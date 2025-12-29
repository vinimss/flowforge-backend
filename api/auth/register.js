// api/auth/register.js
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders() },
  });
}

export default async function handler(req, res) {
  // CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      .end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed', ok: false });
  }

  try {
    const { email, password, fingerprint } = req.body;

    // Validações
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required', ok: false });
    }

    const emailLower = email.toLowerCase().trim();

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailLower)) {
      return res.status(400).json({ error: 'Invalid email format', ok: false });
    }

    // Validar senha (mínimo 6 caracteres)
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters', ok: false });
    }

    // Verificar se email já existe
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', emailLower)
      .single();

    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered', ok: false });
    }

    // Hash da senha
    const passwordHash = await bcrypt.hash(password, 12);

    // Criar usuário
    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert({
        email: emailLower,
        password_hash: passwordHash,
      })
      .select()
      .single();

    if (userError) {
      console.error('Error creating user:', userError);
      return res.status(500).json({ error: 'Failed to create user', ok: false });
    }

    // Gerar token de sessão
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const ipAddress = req.headers['x-forwarded-for']?.split(',')[0]?.trim() 
      || req.headers['x-real-ip'] 
      || 'unknown';

    // Criar sessão
    await supabase.from('user_sessions').insert({
      user_id: newUser.id,
      session_token: sessionToken,
      ip_address: ipAddress,
      user_agent: req.headers['user-agent'] || 'unknown',
      fingerprint: fingerprint || null,
      is_active: true,
    });

    // Log do evento
    await supabase.from('event_logs').insert({
      event_type: 'register',
      user_id: newUser.id,
      email: emailLower,
      ip_address: ipAddress,
      details: { fingerprint },
    });

    // Retornar sucesso (sem licença ainda - precisa fazer checkout)
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(201).json({
      ok: true,
      user: {
        id: newUser.id,
        email: newUser.email,
      },
      token: sessionToken,
      has_license: false,
      needs_checkout: true,
    });

  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Internal server error', ok: false });
  }
}
