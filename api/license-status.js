// api/license-status.js
import { createClient } from '@supabase/supabase-js';

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

    // Verificar se IP mudou (possível compartilhamento)
    if (session.ip_address !== ipAddress) {
      // Verificar se há outra sessão ativa do mesmo usuário
      const { data: otherSessions } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', session.user_id)
        .eq('is_active', true)
        .neq('session_token', token);

      if (otherSessions && otherSessions.length > 0) {
        // Desativar esta sessão - outra sessão tomou conta
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

      // Atualizar IP da sessão (usuário mudou de rede)
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
    res.setHeader('Access-Control-Allow-Origin', '*');

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

    let status = 'expired';
    let canUse = false;

    if (license.active && expiresAt > now) {
      canUse = true;
      if (daysLeft <= 3) {
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
