// api/auth/logout.js
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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed', ok: false });
  }

  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token required', ok: false });
    }

    // Buscar sessão
    const { data: session } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('session_token', token)
      .single();

    if (session) {
      // Desativar sessão
      await supabase
        .from('user_sessions')
        .update({ is_active: false })
        .eq('session_token', token);

      // Log do logout
      await supabase.from('event_logs').insert({
        event_type: 'logout',
        user_id: session.user_id,
        ip_address: req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown',
        details: { session_id: session.id },
      });
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({ ok: true });

  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ error: 'Internal server error', ok: false });
  }
}
