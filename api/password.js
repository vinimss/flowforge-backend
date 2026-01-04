// api/password.js - Handles forgot password and reset password
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

// Service client for database operations
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Auth client (uses service key but works for password reset)
const supabase = supabaseAdmin;

export default async function handler(req, res) {
  const action = req.query.action || 'reset';

  if (action === 'forgot') {
    return handleForgotPassword(req, res);
  } else if (action === 'update' && req.method === 'POST') {
    return handleUpdatePassword(req, res);
  } else {
    return handleResetPassword(req, res);
  }
}

// ===== FORGOT PASSWORD =====
async function handleForgotPassword(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const emailLower = email.toLowerCase();

    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', emailLower)
      .single();

    if (!user) {
      return res.status(200).json({ ok: true, message: 'If the email exists, a reset link will be sent.' });
    }

    const { error } = await supabase.auth.resetPasswordForEmail(emailLower, {
      redirectTo: 'https://flowforge-backend-rust.vercel.app/api/password'
    });

    if (error) {
      console.error('Error sending reset email:', error.message, error.status, JSON.stringify(error));
      return res.status(500).json({ error: 'Failed to send reset email', details: error.message });
    }

    await supabase.from('event_logs').insert({
      event_type: 'password_reset_requested',
      email: emailLower,
      user_id: user.id
    });

    return res.status(200).json({ ok: true, message: 'Reset link sent to your email' });

  } catch (error) {
    console.error('Error in forgot-password:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// ===== UPDATE PASSWORD (called from reset form) =====
async function handleUpdatePassword(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { email, password, access_token } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    if (!access_token) {
      return res.status(400).json({ error: 'Access token required' });
    }

    // 1. Update password in Supabase Auth
    const supabaseUrl = process.env.SUPABASE_URL;
    const anonKey = process.env.SUPABASE_ANON_KEY;

    const authResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`,
        'apikey': anonKey
      },
      body: JSON.stringify({ password })
    });

    if (!authResponse.ok) {
      const errorData = await authResponse.json();
      console.error('Supabase Auth error:', errorData);
      return res.status(400).json({ error: errorData.error_description || 'Failed to update password' });
    }

    const userData = await authResponse.json();

    // 2. Update password hash in users table
    if (userData.email) {
      const passwordHash = await bcrypt.hash(password, 10);
      
      const { error: updateError } = await supabase
        .from('users')
        .update({ password_hash: passwordHash })
        .eq('email', userData.email.toLowerCase());

      if (updateError) {
        console.error('Error updating users table:', updateError);
        // Don't fail - auth password was updated successfully
      }

      // Log the event
      await supabase.from('event_logs').insert({
        event_type: 'password_reset_completed',
        email: userData.email.toLowerCase()
      });
    }

    return res.status(200).json({ ok: true, message: 'Password updated successfully' });

  } catch (error) {
    console.error('Error in update-password:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// ===== RESET PASSWORD PAGE =====
async function handleResetPassword(req, res) {
  const acceptLanguage = req.headers['accept-language'] || 'en';
  let lang = 'en';
  if (acceptLanguage.includes('pt')) lang = 'pt';
  else if (acceptLanguage.includes('es')) lang = 'es';

  const translations = {
    en: {
      title: "Reset Password - FlowForge Pro",
      heading: "Reset Your Password",
      newPassword: "New Password",
      confirmPassword: "Confirm Password",
      btnReset: "Reset Password",
      passwordHint: "Min. 6 characters",
      success: "Password reset successfully!",
      successDesc: "You can now login with your new password in the extension.",
      error: "Error",
      errorExpired: "This reset link has expired or is invalid.",
      errorMismatch: "Passwords do not match.",
      errorMinLength: "Password must be at least 6 characters.",
      errorGeneric: "Failed to reset password. Please try again.",
      btnClose: "Close Window"
    },
    pt: {
      title: "Redefinir Senha - FlowForge Pro",
      heading: "Redefinir Sua Senha",
      newPassword: "Nova Senha",
      confirmPassword: "Confirmar Senha",
      btnReset: "Redefinir Senha",
      passwordHint: "Mín. 6 caracteres",
      success: "Senha redefinida com sucesso!",
      successDesc: "Você já pode fazer login com sua nova senha na extensão.",
      error: "Erro",
      errorExpired: "Este link expirou ou é inválido.",
      errorMismatch: "As senhas não coincidem.",
      errorMinLength: "A senha deve ter pelo menos 6 caracteres.",
      errorGeneric: "Falha ao redefinir senha. Tente novamente.",
      btnClose: "Fechar Janela"
    },
    es: {
      title: "Restablecer Contraseña - FlowForge Pro",
      heading: "Restablecer Tu Contraseña",
      newPassword: "Nueva Contraseña",
      confirmPassword: "Confirmar Contraseña",
      btnReset: "Restablecer Contraseña",
      passwordHint: "Mín. 6 caracteres",
      success: "¡Contraseña restablecida con éxito!",
      successDesc: "Ya puedes iniciar sesión con tu nueva contraseña en la extensión.",
      error: "Error",
      errorExpired: "Este enlace ha expirado o no es válido.",
      errorMismatch: "Las contraseñas no coinciden.",
      errorMinLength: "La contraseña debe tener al menos 6 caracteres.",
      errorGeneric: "Error al restablecer la contraseña. Inténtalo de nuevo.",
      btnClose: "Cerrar Ventana"
    }
  };

  const t = translations[lang];
  const errorCode = req.query.error_code;

  if (errorCode) {
    const html = getErrorHtml(t, lang);
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(html);
  }

  const html = getResetFormHtml(t, lang, process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');
  res.setHeader('Content-Type', 'text/html');
  return res.status(200).send(html);
}

function getErrorHtml(t, lang) {
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${t.title}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; color: #fff; padding: 20px; }
        .container { text-align: center; max-width: 400px; background: rgba(255,255,255,0.03); border-radius: 16px; padding: 40px; }
        .error-icon { width: 80px; height: 80px; background: rgba(255, 107, 107, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 25px; font-size: 40px; }
        h1 { font-size: 24px; margin-bottom: 15px; color: #ff6b6b; }
        p { color: #a0a0a0; margin-bottom: 25px; line-height: 1.6; }
        .btn { display: inline-block; padding: 14px 30px; background: linear-gradient(135deg, #00d9a5 0%, #00b388 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; cursor: pointer; border: none; font-size: 16px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="error-icon">⚠️</div>
        <h1>${t.error}</h1>
        <p>${t.errorExpired}</p>
        <button class="btn" onclick="window.close();">${t.btnClose}</button>
    </div>
</body>
</html>`;
}

function getResetFormHtml(t, lang, supabaseUrl, anonKey) {
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${t.title}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; color: #fff; padding: 20px; }
        .container { width: 100%; max-width: 400px; background: rgba(255,255,255,0.03); border-radius: 16px; padding: 40px; }
        .logo { text-align: center; margin-bottom: 30px; }
        .logo h1 { color: #00d9a5; font-size: 24px; margin-bottom: 5px; }
        .logo p { color: #666; font-size: 14px; }
        h2 { text-align: center; font-size: 20px; margin-bottom: 25px; }
        .form-group { margin-bottom: 20px; }
        label { display: block; margin-bottom: 8px; color: #a0a0a0; font-size: 14px; }
        input { width: 100%; padding: 14px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff; font-size: 16px; }
        input:focus { outline: none; border-color: #00d9a5; }
        .hint { margin-top: 6px; font-size: 12px; color: #666; }
        .btn { width: 100%; padding: 14px; background: linear-gradient(135deg, #00d9a5 0%, #00b388 100%); color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .message { margin-top: 20px; padding: 15px; border-radius: 8px; text-align: center; display: none; }
        .message.error { background: rgba(255, 107, 107, 0.1); border: 1px solid rgba(255, 107, 107, 0.3); color: #ff6b6b; display: block; }
        .success-container { text-align: center; display: none; }
        .success-icon { width: 80px; height: 80px; background: rgba(0, 217, 165, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 25px; font-size: 40px; }
        .success-container h2 { color: #00d9a5; }
        .success-container p { color: #a0a0a0; margin: 15px 0 25px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo"><h1>FlowForge Pro</h1><p>Google Flow Automator</p></div>
        <div id="formContainer">
            <h2>${t.heading}</h2>
            <form id="resetForm">
                <div class="form-group">
                    <label for="password">${t.newPassword}</label>
                    <input type="password" id="password" required minlength="6" />
                    <div class="hint">${t.passwordHint}</div>
                </div>
                <div class="form-group">
                    <label for="confirmPassword">${t.confirmPassword}</label>
                    <input type="password" id="confirmPassword" required minlength="6" />
                </div>
                <button type="submit" class="btn" id="btnSubmit">${t.btnReset}</button>
            </form>
            <div id="message" class="message"></div>
        </div>
        <div id="successContainer" class="success-container">
            <div class="success-icon">✓</div>
            <h2>${t.success}</h2>
            <p>${t.successDesc}</p>
            <button class="btn" onclick="window.close();">${t.btnClose}</button>
        </div>
    </div>
    <script>
        const form = document.getElementById('resetForm');
        const message = document.getElementById('message');
        const btnSubmit = document.getElementById('btnSubmit');
        const formContainer = document.getElementById('formContainer');
        const successContainer = document.getElementById('successContainer');
        const ANON_KEY = '${anonKey}';
        
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (password !== confirmPassword) {
                message.textContent = "${t.errorMismatch}";
                message.className = "message error";
                return;
            }
            if (password.length < 6) {
                message.textContent = "${t.errorMinLength}";
                message.className = "message error";
                return;
            }
            if (!accessToken) {
                message.textContent = "${t.errorExpired}";
                message.className = "message error";
                return;
            }
            
            btnSubmit.disabled = true;
            btnSubmit.textContent = "...";
            message.style.display = "none";
            
            try {
                const response = await fetch('/api/password?action=update', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ password, access_token: accessToken })
                });
                
                const data = await response.json();
                
                if (response.ok && data.ok) {
                    formContainer.style.display = 'none';
                    successContainer.style.display = 'block';
                } else {
                    message.textContent = data.error || "${t.errorGeneric}";
                    message.className = "message error";
                    btnSubmit.disabled = false;
                    btnSubmit.textContent = "${t.btnReset}";
                }
            } catch (error) {
                console.error('Error:', error);
                message.textContent = "${t.errorGeneric}";
                message.className = "message error";
                btnSubmit.disabled = false;
                btnSubmit.textContent = "${t.btnReset}";
            }
        });
    </script>
</body>
</html>`;
}
