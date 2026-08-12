// api/checkout.js
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

const PRICE_ID = 'price_1SpbRgA6WnMHKTVrW6XYt7ZE';

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
    const { token, fingerprint, success_url, cancel_url } = req.body;

    if (!token) {
      return res.status(401).json({ error: 'Authentication required', ok: false });
    }

    const ipAddress = req.headers['x-forwarded-for']?.split(',')[0]?.trim() 
      || req.headers['x-real-ip'] 
      || 'unknown';

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

    // Verificar se ja tem licenca ativa (não trial)
    const { data: existingLicenses } = await supabase
      .from('licenses')
      .select('*')
      .eq('user_id', user.id)
      .order('expires_at', { ascending: false })
      .limit(1);

    const existingLicense = existingLicenses?.[0] || null;

    if (existingLicense) {
      const expiresAt = new Date(existingLicense.expires_at);
      // Só bloqueia se for assinatura ativa (não trial)
      if (existingLicense.active && expiresAt > new Date() && existingLicense.plan_type !== 'trial') {
        return res.status(400).json({ 
          error: 'You already have an active subscription', 
          ok: false,
          license: {
            status: 'active',
            expires_at: existingLicense.expires_at,
          }
        });
      }
    }

    // Buscar ou criar cliente Stripe
    let stripeCustomerId = existingLicense?.stripe_customer_id;

    if (!stripeCustomerId) {
      const existingCustomers = await stripe.customers.list({
        email: user.email,
        limit: 1,
      });

      if (existingCustomers.data.length > 0) {
        stripeCustomerId = existingCustomers.data[0].id;
      } else {
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: {
            user_id: user.id,
            fingerprint: fingerprint || 'unknown',
          },
        });
        stripeCustomerId = customer.id;
      }

      // Atualiza licença com stripe_customer_id se existir
      if (existingLicense) {
        await supabase
          .from('licenses')
          .update({ stripe_customer_id: stripeCustomerId })
          .eq('id', existingLicense.id);
      }
    }

    // Configurar checkout session (sem trial - trial já foi dado no registro)
    const checkoutConfig = {
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: success_url || 'https://flowforge-backend-rust.vercel.app/api/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: cancel_url || 'https://flowforge-backend-rust.vercel.app/api/cancel',
      metadata: {
        user_id: user.id,
        email: user.email,
        fingerprint: fingerprint || 'unknown',
        ip_address: ipAddress,
      },
      subscription_data: {
        metadata: {
          user_id: user.id,
          email: user.email,
        },
      },
    };

    // Criar sessao de checkout
    const checkoutSession = await stripe.checkout.sessions.create(checkoutConfig);

    // Log do evento
    await supabase.from('event_logs').insert({
      event_type: 'checkout_started',
      user_id: user.id,
      email: user.email,
      ip_address: ipAddress,
      details: { 
        checkout_session_id: checkoutSession.id,
        fingerprint,
        from_trial: existingLicense?.plan_type === 'trial',
      },
    });

    return res.status(200).json({
      ok: true,
      checkout_url: checkoutSession.url,
      session_id: checkoutSession.id,
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return res.status(500).json({ error: 'Failed to create checkout session', ok: false });
  }
}
