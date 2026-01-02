// api/send-verification.js
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

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
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Gerar código de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Expira em 10 minutos
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Deletar códigos anteriores para este email
    await supabase
      .from('email_verifications')
      .delete()
      .eq('email', email.toLowerCase());

    // Inserir novo código
    const { error: insertError } = await supabase
      .from('email_verifications')
      .insert({
        email: email.toLowerCase(),
        code,
        expires_at: expiresAt.toISOString(),
        verified: false
      });

    if (insertError) {
      console.error('Error inserting verification code:', insertError);
      return res.status(500).json({ error: 'Failed to create verification code' });
    }

    // Enviar email
    const { error: emailError } = await resend.emails.send({
      from: 'FlowForge Pro <noreply@resend.dev>',
      to: email,
      subject: 'Your FlowForge Pro Verification Code',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #1a1a2e; margin: 0; padding: 40px 20px;">
          <div style="max-width: 400px; margin: 0 auto; background: linear-gradient(135deg, #16213e 0%, #1a1a2e 100%); border-radius: 16px; padding: 40px; text-align: center;">
            <h1 style="color: #00d9a5; font-size: 24px; margin-bottom: 10px;">FlowForge Pro</h1>
            <p style="color: #a0a0a0; font-size: 14px; margin-bottom: 30px;">Email Verification</p>
            
            <p style="color: #ffffff; font-size: 16px; margin-bottom: 20px;">Your verification code is:</p>
            
            <div style="background: rgba(0, 217, 165, 0.1); border: 2px solid #00d9a5; border-radius: 12px; padding: 20px; margin: 20px 0;">
              <span style="font-size: 36px; font-weight: bold; color: #00d9a5; letter-spacing: 8px;">${code}</span>
            </div>
            
            <p style="color: #a0a0a0; font-size: 14px; margin-top: 30px;">This code expires in <strong style="color: #ffffff;">10 minutes</strong>.</p>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">If you didn't request this code, you can safely ignore this email.</p>
          </div>
        </body>
        </html>
      `
    });

    if (emailError) {
      console.error('Error sending email:', emailError);
      return res.status(500).json({ error: 'Failed to send verification email' });
    }

    // Log do evento
    await supabase.from('event_logs').insert({
      event_type: 'verification_code_sent',
      email: email.toLowerCase(),
      details: { expires_at: expiresAt.toISOString() }
    });

    return res.status(200).json({ 
      ok: true, 
      message: 'Verification code sent',
      expires_in: 600 // 10 minutes in seconds
    });

  } catch (error) {
    console.error('Error in send-verification:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
