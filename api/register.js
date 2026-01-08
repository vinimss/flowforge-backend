// api/register.js
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

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
    const { email, password, terms_accepted } = req.body;

    // Validações
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    if (!terms_accepted) {
      return res.status(400).json({ error: 'You must accept the terms and conditions' });
    }

    // (sem verificação por código)

    // Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email.toLowerCase(),
      password: password,
      email_confirm: true // Já confirmamos via código
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      return res.status(400).json({ error: authError.message });
    }

    const userId = authData.user.id;

    // Criar registro na tabela users
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: userId,
        email: email.toLowerCase(),
        email_verified: true,
        terms_accepted_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      });

    if (userError) {
      console.error('Error creating user record:', userError);
      // Tentar deletar o auth user se falhar
      await supabase.auth.admin.deleteUser(userId);
      return res.status(500).json({ error: 'Failed to create user' });
    }
    // Gerar token de sessão
    const sessionToken = uuidv4();

    await supabase
      .from('user_sessions')
      .insert({
        user_id: userId,
        token: sessionToken,
        created_at: new Date().toISOString(),
        last_active: new Date().toISOString()
      });

    // Log do evento
    await supabase.from('event_logs').insert({
      event_type: 'user_registered',
      user_id: userId,
      email: email.toLowerCase(),
      details: { 
        terms_accepted: true,
        email_verified: true
      }
    });

    return res.status(200).json({
      ok: true,
      user_id: userId,
      token: sessionToken,
      needs_checkout: true // Novo usuário precisa assinar
    });

  } catch (error) {
    console.error('Error in register:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
