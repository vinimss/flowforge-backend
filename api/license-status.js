// api/license-status.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Helper para adicionar CORS headers
function corsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return res;
}

export default async function handler(req, res) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return corsHeaders(res).status(200).end();
  }

  // Adiciona CORS em todas as respostas
  corsHeaders(res);

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed', ok: false });
  }

  try {
    // Pegar token do header ou body
    let token = req.headers.authorization?.replace('Bearer ', '');
    if (!token && req.body?.token) {
      token = req.body.token;
    }

    if (!token) {
      return res.status(401).json({ error: 'Authentication required', ok: false });
    }

    const ipAddress = req.headers['x-forwarded-for']?.split(',')[0]?.trim() 
      || req.headers['x-real-ip'] 
      || 'unknown';

    // Validar sessão
    const { data: session, error: sessionError } = await supabase
      .from('user_sessions')
      .select('*, users(*)')
      .eq('session_token', token)
      .eq('is_active', true)
      .single();

    if (!session || sessionError) {
      return res.status(401).json({ 
        error: 'Invalid or expired session', 
        ok: false,
        code: 'SESSION_INVALID'
      });
    }

    // Verificar se IP mudou E se há sessão de OUTRO IP (compartilhamento)
    // Permitimos múltiplas sessões do MESMO IP (até 5)
    if (session.ip_address !== ipAddress) {
      // Verificar se há outra sessão ativa de OUTRO IP
      const { data: otherIpSessions } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', session.user_id)
        .eq('is_active', true)
        .neq('session_token', token)
        .neq('ip_address', session.ip_address); // Sessões de IPs diferentes do original

      if (otherIpSessions && otherIpSessions.length > 0) {
        // Há sessão ativa de outro IP - esta sessão foi "roubada"
        // A sessão mais recente ganha
        const thisSessionTime = new Date(session.last_heartbeat || session.created_at);
        
        for (const otherSession of otherIpSessions) {
          const otherTime = new Date(otherSession.last_heartbeat || otherSession.created_at);
          
          if (otherTime > thisSessionTime) {
            // Outra sessão é mais recente - desativar esta
            await supabase
              .from('user_sessions')
              .update({ is_active: false })
              .eq('session_token', token);

            return res.status(401).json({
              error: 'Session terminated - logged in from another location',
              ok: false,
              code: 'SESSION_CONFLICT'
            });
          }
        }
      }

      // Se chegou aqui, esta sessão é válida - apenas atualizar o IP
      await supabase
        .from('user_sessions')
        .update({ ip_address: ipAddress })
        .eq('session_token', token);
    }

    const user = session.users;

    // Buscar licença
    const { data: license } = await supabase
      .from('licenses')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Atualizar último heartbeat
    await supabase
      .from('user_sessions')
      .update({ last_heartbeat: new Date().toISOString() })
      .eq('session_token', token);

    // Calcular status da licença
    if (!license) {
      return res.status(200).json({
        ok: true,
        has_license: false,
        needs_checkout: true,
        user: {
          id: user.id,
          email: user.email,
        },
      });
    }

    const now = new Date();
    const expiresAt = new Date(license.expires_at);
    const daysLeft = Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24));
    const isTrial = license.plan_type === 'trial';

    let status = 'expired';
    let canUse = false;

    if (license.active && expiresAt > now) {
      canUse = true;
      // Para trials: nunca mostrar "expiring", só "active"
      if (!isTrial && daysLeft <= 3) {
        status = 'expiring';
      } else {
        status = 'active';
      }
    }

    return res.status(200).json({
      ok: true,
      has_license: true,
      can_use: canUse,
      needs_checkout: !canUse,
      license: {
        status,
        expires_at: license.expires_at,
        days_left: Math.max(0, daysLeft),
        plan_type: license.plan_type,
        trial_used: license.trial_used,
      },
      user: {
        id: user.id,
        email: user.email,
      },
    });

  } catch (error) {
    console.error('License status error:', error);
    return res.status(500).json({ error: 'Internal server error', ok: false });
  }
}
