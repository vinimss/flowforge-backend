// api/heartbeat.js
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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed', ok: false });
  }

  try {
    const { token } = req.body;

    if (!token) {
      return res.status(401).json({ error: 'Token required', ok: false });
    }

    const ipAddress = req.headers['x-forwarded-for']?.split(',')[0]?.trim() 
      || req.headers['x-real-ip'] 
      || 'unknown';

    // Validar sessão
    const { data: session, error: sessionError } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('session_token', token)
      .eq('is_active', true)
      .single();

    if (!session || sessionError) {
      return res.status(401).json({ 
        ok: false, 
        valid: false,
        code: 'SESSION_INVALID',
        message: 'Session expired or invalid'
      });
    }

    // Verificar conflito de IP - apenas sessões de OUTROS IPs
    // Permitimos múltiplas sessões do MESMO IP (até 5 fingerprints)
    const { data: otherIpSessions } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('user_id', session.user_id)
      .eq('is_active', true)
      .neq('session_token', token)
      .neq('ip_address', ipAddress); // Apenas sessões de IPs DIFERENTES

    if (otherIpSessions && otherIpSessions.length > 0) {
      // Há sessões ativas de outros IPs - verificar qual é mais recente
      const thisSessionTime = new Date(session.last_heartbeat || session.created_at);
      
      for (const otherSession of otherIpSessions) {
        const otherTime = new Date(otherSession.last_heartbeat || otherSession.created_at);
        
        if (otherTime > thisSessionTime) {
          // Outra sessão (de outro IP) é mais recente - desativar esta
          await supabase
            .from('user_sessions')
            .update({ is_active: false })
            .eq('session_token', token);

          return res.status(401).json({
            ok: false,
            valid: false,
            code: 'SESSION_CONFLICT',
            message: 'Logged in from another device'
          });
        }
      }

      // Esta sessão é mais recente - desativar as sessões de outros IPs
      await supabase
        .from('user_sessions')
        .update({ is_active: false })
        .in('id', otherIpSessions.map(s => s.id));
    }

    // Atualizar heartbeat e IP
    await supabase
      .from('user_sessions')
      .update({ 
        last_heartbeat: new Date().toISOString(),
        ip_address: ipAddress,
      })
      .eq('session_token', token);

    return res.status(200).json({
      ok: true,
      valid: true,
      ip: ipAddress,
    });

  } catch (error) {
    console.error('Heartbeat error:', error);
    return res.status(500).json({ error: 'Internal server error', ok: false });
  }
}
