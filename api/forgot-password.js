// api/forgot-password.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
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
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const emailLower = email.toLowerCase();

    // Verificar se o usuário existe
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', emailLower)
      .single();

    if (!user) {
      // Por segurança, não revelamos se o email existe ou não
      return res.status(200).json({ 
        ok: true, 
        message: 'If the email exists, a reset link will be sent.' 
      });
    }

    // Enviar email de reset usando Supabase Auth
    const { error } = await supabase.auth.resetPasswordForEmail(emailLower, {
      redirectTo: 'https://flowforge-backend-rust.vercel.app/api/reset-password'
    });

    if (error) {
      console.error('Error sending reset email:', error);
      return res.status(500).json({ error: 'Failed to send reset email' });
    }

    // Log do evento
    await supabase.from('event_logs').insert({
      event_type: 'password_reset_requested',
      email: emailLower,
      user_id: user.id
    });

    return res.status(200).json({ 
      ok: true, 
      message: 'Reset link sent to your email' 
    });

  } catch (error) {
    console.error('Error in forgot-password:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
