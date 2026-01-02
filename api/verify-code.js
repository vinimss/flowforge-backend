// api/verify-code.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: 'Email and code are required' });
    }

    // Buscar código válido
    const { data: verification, error: fetchError } = await supabase
      .from('email_verifications')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('code', code)
      .eq('verified', false)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (fetchError || !verification) {
      return res.status(400).json({ 
        error: 'invalid_code',
        message: 'Invalid or expired verification code' 
      });
    }

    // Marcar como verificado
    await supabase
      .from('email_verifications')
      .update({ verified: true })
      .eq('id', verification.id);

    // Log do evento
    await supabase.from('event_logs').insert({
      event_type: 'email_verified',
      email: email.toLowerCase(),
      details: { verification_id: verification.id }
    });

    return res.status(200).json({ 
      ok: true, 
      message: 'Email verified successfully',
      verified: true
    });

  } catch (error) {
    console.error('Error in verify-code:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
