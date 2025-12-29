// api/auth/login.js
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  // CORS
  if (req.method === 'OPTIONS') {
    return res.status(200)
      .setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      .end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed', ok: false });
  }

  try {
    const { email, password, fingerprint } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required', ok: false });
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
      return res.status(401).json({ error: 'Invalid credentials', ok: false });
    }

    // Verificar senha
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials', ok: false });
    }

    // Verificar sessões ativas de outros IPs
    const { data: activeSessions } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .neq('ip_address', ipAddress);

    // Se há sessões ativas de outros IPs, desativar
    if (activeSessions && activeSessions.length > 0) {
      await supabase
        .from('user_sessions')
        .update({ is_active: false })
        .eq('user_id', user.id)
        .neq('ip_address', ipAddress);

      // Log do conflito de sessão
      await supabase.from('event_logs').insert({
        event_type: 'session_conflict',
        user_id: user.id,
        email: emailLower,
        ip_address: ipAddress,
        details: { 
          terminated_sessions: activeSessions.map(s => ({
            ip: s.ip_address,
            created_at: s.created_at
          }))
        },
      });
    }

    // Desativar sessões antigas do mesmo IP (limpar)
    await supabase
      .from('user_sessions')
      .update({ is_active: false })
      .eq('user_id', user.id)
      .eq('ip_address', ipAddress);

    // Gerar novo token de sessão
    const sessionToken = crypto.randomBytes(32).toString('hex');

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

    // Log do login
    await supabase.from('event_logs').insert({
      event_type: 'login',
      user_id: user.id,
      email: emailLower,
      ip_address: ipAddress,
      details: { 
        fingerprint,
        has_license: !!license,
        other_sessions_terminated: activeSessions?.length || 0
      },
    });

    // Calcular status da licença
    let licenseStatus = null;
    let needsCheckout = true;

    if (license) {
      const now = new Date();
      const expiresAt = new Date(license.expires_at);
      const daysLeft = Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24));

      needsCheckout = false;

      if (license.active && expiresAt > now) {
        if (daysLeft <= 3) {
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

    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
      },
      token: sessionToken,
      license: licenseStatus,
      needs_checkout: needsCheckout,
      sessions_terminated: activeSessions?.length || 0,
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error', ok: false });
  }
}
