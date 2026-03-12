// api/auth/login.js
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const MAX_SESSIONS_PER_IP = 5;  // <-- Limite de sessões por IP

// Helper para resposta com CORS
function jsonResponse(res, status, data) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.status(status).json(data);
}

export default async function handler(req, res) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return jsonResponse(res, 405, { error: 'Method not allowed', ok: false });
  }

  try {
    const { email, password, fingerprint } = req.body;

    if (!email || !password) {
      return jsonResponse(res, 400, { error: 'Email and password required', ok: false });
    }

    const emailLower = email.toLowerCase().trim();
    const ipAddress = req.headers['x-forwarded-for']?.split(',')[0]?.trim() 
      || req.headers['x-real-ip'] 
      || 'unknown';

    // Buscar usuário
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', emailLower)
      .single();

    if (!user || userError) {
      return jsonResponse(res, 401, { error: 'Invalid credentials', ok: false });
    }

    // Verificar senha
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return jsonResponse(res, 401, { error: 'Invalid credentials', ok: false });
    }

    // ============================================
    // NOVA LÓGICA: Permitir até 5 sessões por IP
    // ============================================

    // 1. Verificar sessões ativas de OUTROS IPs (essas devem ser desativadas)
    const { data: otherIpSessions } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .neq('ip_address', ipAddress);

    // Se há sessões ativas de outros IPs, desativar TODAS
    let sessionsTerminated = 0;
    if (otherIpSessions && otherIpSessions.length > 0) {
      await supabase
        .from('user_sessions')
        .update({ is_active: false })
        .eq('user_id', user.id)
        .neq('ip_address', ipAddress);

      sessionsTerminated = otherIpSessions.length;

      // Log do conflito de sessão
      await supabase.from('event_logs').insert({
        event_type: 'session_conflict',
        user_id: user.id,
        email: emailLower,
        ip_address: ipAddress,
        details: { 
          terminated_sessions: otherIpSessions.map(s => ({
            ip: s.ip_address,
            created_at: s.created_at
          }))
        },
      });
    }

    // 2. Verificar sessões ativas do MESMO IP
    const { data: sameIpSessions } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('user_id', user.id)
      .eq('ip_address', ipAddress)
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    // Se já tem 5 ou mais sessões do mesmo IP, desativar a mais antiga
    if (sameIpSessions && sameIpSessions.length >= MAX_SESSIONS_PER_IP) {
      // Desativar as sessões mais antigas (manter apenas MAX-1 para dar espaço à nova)
      const sessionsToRemove = sameIpSessions.length - MAX_SESSIONS_PER_IP + 1;
      const oldestSessions = sameIpSessions.slice(0, sessionsToRemove);
      
      for (const oldSession of oldestSessions) {
        await supabase
          .from('user_sessions')
          .update({ is_active: false })
          .eq('id', oldSession.id);
      }
    }

    // 3. Verificar se já existe sessão com este fingerprint (atualizar em vez de criar)
    let sessionToken;
    
    if (fingerprint) {
      const { data: existingSession } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('fingerprint', fingerprint)
        .eq('ip_address', ipAddress)
        .eq('is_active', true)
        .single();

      if (existingSession) {
        // Atualizar sessão existente
        sessionToken = existingSession.session_token;
        await supabase
          .from('user_sessions')
          .update({ 
            last_heartbeat: new Date().toISOString(),
            user_agent: req.headers['user-agent'] || 'unknown',
          })
          .eq('id', existingSession.id);
      }
    }

    // 4. Se não encontrou sessão existente, criar nova
    if (!sessionToken) {
      sessionToken = crypto.randomBytes(32).toString('hex');

      // Buscar licença do usuário
      const { data: license } = await supabase
        .from('licenses')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Criar nova sessão
      await supabase.from('user_sessions').insert({
        user_id: user.id,
        license_id: license?.id || null,
        session_token: sessionToken,
        ip_address: ipAddress,
        user_agent: req.headers['user-agent'] || 'unknown',
        fingerprint: fingerprint || null,
        is_active: true,
      });
    }

    // Buscar licença do usuário
    const { data: license } = await supabase
      .from('licenses')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Log do login
    await supabase.from('event_logs').insert({
      event_type: 'login',
      user_id: user.id,
      email: emailLower,
      ip_address: ipAddress,
      details: { 
        fingerprint,
        has_license: !!license,
        other_ip_sessions_terminated: sessionsTerminated,
        same_ip_sessions: sameIpSessions?.length || 0,
      },
    });

    // Calcular status da licença
    let licenseStatus = null;
    let needsCheckout = true;

    if (license) {
      const now = new Date();
      const expiresAt = new Date(license.expires_at);
      const daysLeft = Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24));
      const isTrial = license.plan_type === 'trial';

      needsCheckout = false;

      if (license.active && expiresAt > now) {
        // Para trials: nunca mostrar "expiring", só "active"
        // Para assinaturas: mostrar "expiring" se <= 3 dias
        if (!isTrial && daysLeft <= 3) {
          licenseStatus = {
            status: 'expiring',
            expires_at: license.expires_at,
            days_left: daysLeft,
            plan_type: license.plan_type,
          };
        } else {
          licenseStatus = {
            status: 'active',
            expires_at: license.expires_at,
            days_left: daysLeft,
            plan_type: license.plan_type,
          };
        }
      } else {
        licenseStatus = {
          status: 'expired',
          expires_at: license.expires_at,
          days_left: 0,
          plan_type: license.plan_type,
        };
        needsCheckout = true; // Precisa renovar
      }
    }

    return jsonResponse(res, 200, {
      ok: true,
      user: {
        id: user.id,
        email: user.email,
      },
      token: sessionToken,
      license: licenseStatus,
      needs_checkout: needsCheckout,
      sessions_terminated: sessionsTerminated,
    });

  } catch (error) {
    console.error('Login error:', error);
    return jsonResponse(res, 500, { error: 'Internal server error', ok: false });
  }
}
