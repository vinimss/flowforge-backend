import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
;

function normalizeEmail(e) {
  return String(e || "").trim().toLowerCase();
}



const COMMON_DOMAIN_TYPOS = {"hotmails.com": "hotmail.com", "hotmail.con": "hotmail.com", "hotmai.com": "hotmail.com", "gmal.com": "gmail.com", "gmial.com": "gmail.com", "gmai.com": "gmail.com", "gmail.con": "gmail.com", "outlok.com": "outlook.com", "outllok.com": "outlook.com", "outlook.con": "outlook.com", "yaho.com": "yahoo.com", "yahho.com": "yahoo.com", "yahoo.con": "yahoo.com", "iclud.com": "icloud.com", "icould.com": "icloud.com", "icloud.con": "icloud.com", "live.con": "live.com", "msn.con": "msn.com"};

function suggestEmailDomainFix(email) {
  const parts = String(email || "").split("@");
  if (parts.length !== 2) return null;
  const domain = parts[1].toLowerCase();
  return COMMON_DOMAIN_TYPOS[domain] || null;
}



const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  // CORS
  if (req.method === 'OPTIONS') {
    return res.status(200)
      .setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      .end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed', ok: false });
  }

  try {
    const { email, password, fingerprint, terms_accepted } = req.body || {};

    const emailNorm = normalizeEmail(email);
    if (!EMAIL_RE.test(emailNorm)) {
      return res.status(400).json({ ok: false, error: "Invalid email format" });

    const suggestedDomain = suggestEmailDomainFix(emailNorm);
    if (suggestedDomain) {
      return res.status(400).json({ ok: false, error: "Email domain looks wrong", code: "EMAIL_DOMAIN_TYPO", suggestion: suggestedDomain });
    }
    }


    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required', ok: false });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters', ok: false });
    }

    if (!terms_accepted) {
      return res.status(400).json({ error: 'You must accept the terms and conditions', ok: false });
    }

    const emailLower = email.toLowerCase().trim();
    const ipAddress = req.headers['x-forwarded-for']?.split(',')[0]?.trim()
      || req.headers['x-real-ip']
      || 'unknown';

    // Check if already registered in our users table
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', emailLower)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered', ok: false });
    }

    // 1) Create user in Supabase Auth (needed for password reset emails)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: emailLower,
      password,
      email_confirm: true, // email verification not required
    });

    if (authError || !authData?.user?.id) {
      console.error('Error creating auth user:', authError);
      return res.status(400).json({ error: authError?.message || 'Failed to create user', ok: false });
    }

    const userId = authData.user.id;

    // 2) Store password hash in our users table (used by /login)
    const passwordHash = await bcrypt.hash(password, 10);

    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: userId,
        email: emailLower,
        password_hash: passwordHash,
        email_verified: true,
        terms_accepted_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      });

    if (userError) {
      console.error('Error creating user record:', userError);
      // Rollback auth user if our DB insert fails
      await supabase.auth.admin.deleteUser(userId);
      return res.status(500).json({ error: 'Failed to create user', ok: false });
    }

    // 3) Create session (token used by license-status)
    const sessionToken = crypto.randomBytes(32).toString('hex');

    await supabase.from('user_sessions').insert({
      user_id: userId,
      session_token: sessionToken,
      ip_address: ipAddress,
      user_agent: req.headers['user-agent'] || 'unknown',
      fingerprint: fingerprint || null,
      is_active: true,
    });

    // Log event
    await supabase.from('event_logs').insert({
      event_type: 'user_registered',
      user_id: userId,
      email: emailLower,
      ip_address: ipAddress,
      details: {
        terms_accepted: true,
        email_verified: true,
        fingerprint: fingerprint || null,
      },
    });

    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({
      ok: true,
      user: { id: userId, email: emailLower },
      token: sessionToken,
      needs_checkout: true,
      has_license: false,
    });

  } catch (error) {
    console.error('Error in register:', error);
    return res.status(500).json({ error: 'Internal server error', ok: false });
  }
}
