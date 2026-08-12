// api/customer-portal.js
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

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
      return res.status(401).json({ error: 'Authentication required', ok: false });
    }

    // Validar sessao
    const { data: session } = await supabase
      .from('user_sessions')
      .select('*, users(*)')
      .eq('session_token', token)
      .eq('is_active', true)
      .single();

    if (!session) {
      return res.status(401).json({ error: 'Invalid or expired session', ok: false });
    }

    const user = session.users;

    // Buscar licenca do usuario (prioriza a com stripe_customer_id)
    const { data: licenses } = await supabase
      .from('licenses')
      .select('*')
      .eq('user_id', user.id)
      .order('expires_at', { ascending: false })
      .limit(1);

    const license = licenses?.[0] || null;

    if (!license || !license.stripe_customer_id) {
      return res.status(400).json({ 
        error: 'No active subscription found', 
        ok: false 
      });
    }

    // Criar sessao do Customer Portal
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: license.stripe_customer_id,
      return_url: 'https://flowforge-backend-rust.vercel.app/api/portal-return',
    });

    // Log do evento
    await supabase.from('event_logs').insert({
      event_type: 'customer_portal_opened',
      user_id: user.id,
      email: user.email,
      details: { 
        portal_url: portalSession.url,
      },
    });

    return res.status(200).json({
      ok: true,
      portal_url: portalSession.url,
    });

  } catch (error) {
    console.error('Customer portal error:', error);
    return res.status(500).json({ error: 'Failed to create portal session', ok: false });
  }
}
