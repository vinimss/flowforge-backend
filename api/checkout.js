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

const PRICE_ID = 'price_1SjPMdA4LY5asU1J4urTPUPp';
const TRIAL_DAYS = 1;
const MAX_TRIALS_PER_IP = 3;

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
    const { token, fingerprint, success_url, cancel_url } = req.body;

    if (!token) {
      return res.status(401).json({ error: 'Authentication required', ok: false });
    }

    const ipAddress = req.headers['x-forwarded-for']?.split(',')[0]?.trim() 
      || req.headers['x-real-ip'] 
      || 'unknown';

    // Validar sessão
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

    // Verificar se já tem licença ativa
    const { data: existingLicense } = await supabase
      .from('licenses')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (existingLicense) {
      const expiresAt = new Date(existingLicense.expires_at);
      if (existingLicense.active && expiresAt > new Date()) {
        return res.status(400).json({ 
          error: 'You already have an active license', 
          ok: false,
          license: {
            status: 'active',
            expires_at: existingLicense.expires_at,
          }
        });
      }
    }

    // Verificar elegibilidade para trial
    let trialEligible = true;
    let trialBlockReason = null;

    // 1. Verificar fingerprint
    if (fingerprint) {
      const { data: existingFingerprint } = await supabase
        .from('trial_fingerprints')
        .select('*')
        .eq('fingerprint', fingerprint)
        .single();

      if (existingFingerprint) {
        trialEligible = false;
        trialBlockReason = 'Device already used trial';
      }
    }

    // 2. Verificar limite de trials por IP
    if (trialEligible) {
      const { count } = await supabase
        .from('trial_fingerprints')
        .select('*', { count: 'exact', head: true })
        .eq('ip_address', ipAddress)
        .gte('used_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (count >= MAX_TRIALS_PER_IP) {
        trialEligible = false;
        trialBlockReason = 'Too many trials from this location';
      }
    }

    // 3. Verificar se usuário já usou trial
    if (trialEligible && existingLicense?.trial_used) {
      trialEligible = false;
      trialBlockReason = 'Trial already used on this account';
    }

    // Buscar ou criar cliente Stripe
    let stripeCustomerId = existingLicense?.stripe_customer_id;

    if (!stripeCustomerId) {
      // Verificar se já existe customer com esse email
      const existingCustomers = await stripe.customers.list({
        email: user.email,
        limit: 1,
      });

      if (existingCustomers.data.length > 0) {
        stripeCustomerId = existingCustomers.data[0].id;
      } else {
        // Criar novo customer
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: {
            user_id: user.id,
            fingerprint: fingerprint || 'unknown',
          },
        });
        stripeCustomerId = customer.id;
      }
    }

    // Configurar checkout session
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
      success_url: success_url || 'https://flowforge.pro/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: cancel_url || 'https://flowforge.pro/cancel',
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

    // Adicionar trial se elegível
    if (trialEligible) {
      checkoutConfig.subscription_data.trial_period_days = TRIAL_DAYS;
      
      // Registrar fingerprint para bloquear futuros trials
      if (fingerprint) {
        await supabase.from('trial_fingerprints').insert({
          fingerprint,
          email: user.email,
          ip_address: ipAddress,
          user_agent: req.headers['user-agent'] || 'unknown',
        });
      }
    }

    // Criar sessão de checkout
    const checkoutSession = await stripe.checkout.sessions.create(checkoutConfig);

    // Log do evento
    await supabase.from('event_logs').insert({
      event_type: 'checkout_started',
      user_id: user.id,
      email: user.email,
      ip_address: ipAddress,
      details: { 
        checkout_session_id: checkoutSession.id,
        trial_eligible: trialEligible,
        trial_block_reason: trialBlockReason,
        fingerprint,
      },
    });

    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({
      ok: true,
      checkout_url: checkoutSession.url,
      session_id: checkoutSession.id,
      trial_eligible: trialEligible,
      trial_block_reason: trialBlockReason,
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return res.status(500).json({ error: 'Failed to create checkout session', ok: false });
  }
}
