// api/webhook.js
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { buffer } from 'micro';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Desabilitar body parser do Next.js para webhooks
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let event;

  try {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];

    if (!sig || !webhookSecret) {
      console.error('Missing signature or webhook secret');
      return res.status(400).json({ error: 'Missing signature' });
    }

    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  console.log('Webhook event received:', event.type);

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        await handleCheckoutComplete(session);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        await handleSubscriptionCanceled(subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        await handlePaymentSucceeded(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({ received: true });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}

async function handleCheckoutComplete(session) {
  console.log('Processing checkout.session.completed:', session.id);

  const userId = session.metadata?.user_id;
  const email = session.metadata?.email || session.customer_email;
  const customerId = session.customer;
  const subscriptionId = session.subscription;
  const fingerprint = session.metadata?.fingerprint;
  const ipAddress = session.metadata?.ip_address;
  const trialEligible = session.metadata?.trial_eligible === 'true';

  if (!userId) {
    console.error('No user_id in checkout session metadata');
    return;
  }

  // Buscar detalhes da subscription
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  
  const isTrialing = subscription.status === 'trialing';
  const currentPeriodEnd = new Date(subscription.current_period_end * 1000);

  // Verificar se já existe licença para este usuário
  const { data: existingLicense } = await supabase
    .from('licenses')
    .select('*')
    .eq('user_id', userId)
    .single();

  const licenseData = {
    user_id: userId,
    email: email,
    active: true,
    expires_at: currentPeriodEnd.toISOString(),
    stripe_customer_id: customerId,
    stripe_subscription_id: subscriptionId,
    plan_type: isTrialing ? 'trial' : 'monthly',
    trial_used: isTrialing ? true : (existingLicense?.trial_used || false),
  };

  if (existingLicense) {
    // Atualizar licença existente
    await supabase
      .from('licenses')
      .update(licenseData)
      .eq('id', existingLicense.id);
  } else {
    // Criar nova licença
    await supabase.from('licenses').insert(licenseData);
  }

  // ============================================
  // REGISTRAR FINGERPRINT AQUI (após pagamento confirmado!)
  // ============================================
  if (isTrialing && fingerprint && fingerprint !== 'unknown') {
    // Verificar se já existe
    const { data: existingFp } = await supabase
      .from('trial_fingerprints')
      .select('*')
      .eq('fingerprint', fingerprint)
      .single();

    if (existingFp) {
      // Atualizar para marcar como completado
      await supabase
        .from('trial_fingerprints')
        .update({ 
          checkout_completed: true,
          email: email,
        })
        .eq('fingerprint', fingerprint);
    } else {
      // Inserir novo
      await supabase.from('trial_fingerprints').insert({
        fingerprint,
        email: email,
        ip_address: ipAddress || 'unknown',
        user_agent: 'webhook',
        checkout_completed: true,  // <-- Marca como completado
      });
    }

    console.log(`Trial fingerprint registered: ${fingerprint}`);
  }

  // Log do evento
  await supabase.from('event_logs').insert({
    event_type: 'checkout_completed',
    user_id: userId,
    email: email,
    details: {
      checkout_session_id: session.id,
      subscription_id: subscriptionId,
      customer_id: customerId,
      is_trialing: isTrialing,
      expires_at: currentPeriodEnd.toISOString(),
      fingerprint_registered: isTrialing && fingerprint ? true : false,
    },
  });

  console.log(`License activated for user ${userId}, expires: ${currentPeriodEnd}`);
}

async function handleSubscriptionUpdate(subscription) {
  console.log('Processing subscription update:', subscription.id);

  const customerId = subscription.customer;
  const subscriptionId = subscription.id;
  const status = subscription.status;
  const currentPeriodEnd = new Date(subscription.current_period_end * 1000);
  const canceledAt = subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null;

  // Buscar licença pelo stripe_subscription_id
  let { data: license } = await supabase
    .from('licenses')
    .select('*')
    .eq('stripe_subscription_id', subscriptionId)
    .single();

  if (!license) {
    // Tentar buscar pelo customer_id
    const { data: licenseByCustomer } = await supabase
      .from('licenses')
      .select('*')
      .eq('stripe_customer_id', customerId)
      .single();

    if (!licenseByCustomer) {
      console.log('No license found for subscription:', subscriptionId);
      return;
    }
    
    license = licenseByCustomer;
  }

  // Atualizar baseado no status
  const isActive = ['active', 'trialing'].includes(status);
  const planType = status === 'trialing' ? 'trial' : 'monthly';

  await supabase
    .from('licenses')
    .update({
      active: isActive,
      expires_at: currentPeriodEnd.toISOString(),
      plan_type: planType,
      stripe_subscription_id: subscriptionId,
      canceled_at: canceledAt ? canceledAt.toISOString() : null,
    })
    .eq('id', license.id);

  // Log do evento
  await supabase.from('event_logs').insert({
    event_type: 'subscription_updated',
    user_id: license.user_id,
    email: license.email,
    details: {
      subscription_id: subscriptionId,
      status,
      canceled_at: canceledAt ? canceledAt.toISOString() : null,
      expires_at: currentPeriodEnd.toISOString(),
    },
  });

  console.log(`Subscription ${subscriptionId} updated: status=${status}, canceled_at=${canceledAt}`);
}

async function handleSubscriptionCanceled(subscription) {
  console.log('Processing subscription canceled:', subscription.id);

  const subscriptionId = subscription.id;

  // Buscar e desativar licença
  const { data: license } = await supabase
    .from('licenses')
    .select('*')
    .eq('stripe_subscription_id', subscriptionId)
    .single();

  if (license) {
    await supabase
      .from('licenses')
      .update({
        active: false,
        canceled_at: new Date().toISOString(),
      })
      .eq('id', license.id);

    // Log do evento
    await supabase.from('event_logs').insert({
      event_type: 'subscription_canceled',
      user_id: license.user_id,
      email: license.email,
      details: {
        subscription_id: subscriptionId,
      },
    });

    console.log(`License deactivated for subscription ${subscriptionId}`);
  }
}

async function handlePaymentSucceeded(invoice) {
  console.log('Processing payment succeeded:', invoice.id);

  const subscriptionId = invoice.subscription;
  const customerId = invoice.customer;

  if (!subscriptionId) return;

  // Buscar subscription para obter nova data de expiração
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const currentPeriodEnd = new Date(subscription.current_period_end * 1000);

  // Atualizar licença
  const { data: license } = await supabase
    .from('licenses')
    .select('*')
    .eq('stripe_subscription_id', subscriptionId)
    .single();

  if (license) {
    await supabase
      .from('licenses')
      .update({
        active: true,
        expires_at: currentPeriodEnd.toISOString(),
        plan_type: 'monthly', // Após trial, é monthly
      })
      .eq('id', license.id);

    // Log do evento
    await supabase.from('event_logs').insert({
      event_type: 'payment_succeeded',
      user_id: license.user_id,
      email: license.email,
      details: {
        invoice_id: invoice.id,
        amount_paid: invoice.amount_paid,
        subscription_id: subscriptionId,
        new_expires_at: currentPeriodEnd.toISOString(),
      },
    });

    console.log(`Payment succeeded, license extended to ${currentPeriodEnd}`);
  }
}

async function handlePaymentFailed(invoice) {
  console.log('Processing payment failed:', invoice.id);

  const subscriptionId = invoice.subscription;

  if (!subscriptionId) return;

  // Buscar licença
  const { data: license } = await supabase
    .from('licenses')
    .select('*')
    .eq('stripe_subscription_id', subscriptionId)
    .single();

  if (license) {
    // Log do evento (não desativamos imediatamente, Stripe tenta novamente)
    await supabase.from('event_logs').insert({
      event_type: 'payment_failed',
      user_id: license.user_id,
      email: license.email,
      details: {
        invoice_id: invoice.id,
        subscription_id: subscriptionId,
        attempt_count: invoice.attempt_count,
      },
    });

    console.log(`Payment failed for subscription ${subscriptionId}`);
  }
}
