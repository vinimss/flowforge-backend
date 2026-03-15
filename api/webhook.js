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

// ---------- Helpers ----------
function _toEpochSeconds(n) {
  const v = Number(n);
  return Number.isFinite(v) && v > 0 ? v : null;
}

function _dateFromEpochSeconds(sec) {
  const s = _toEpochSeconds(sec);
  if (!s) return null;
  const d = new Date(s * 1000);
  return Number.isNaN(d.getTime()) ? null : d;
}

// Stripe às vezes entrega um "subscription" parcial em certos eventos.
// Pra não perder o expires_at, sempre tenta garantir os campos via retrieve().
async function getCurrentPeriodEndDate(subscription) {
  if (!subscription?.id) return null;

  // 1) tenta direto do payload do evento
  let d = _dateFromEpochSeconds(subscription.current_period_end);
  if (d) return d;

  // 2) fallback: buscar no Stripe
  try {
    const full = await stripe.subscriptions.retrieve(subscription.id);
    d = _dateFromEpochSeconds(full?.current_period_end);
    if (d) return d;

    // 3) fallback extra: alguns estados/cancelamentos podem ter outros campos
    return (
      _dateFromEpochSeconds(full?.trial_end) ||
      _dateFromEpochSeconds(full?.cancel_at) ||
      _dateFromEpochSeconds(full?.ended_at) ||
      null
    );
  } catch (e) {
    return null;
  }
}

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
    return res.status(400).json({ error: 'Webhook signature verification failed' });
  }

  try {
    console.log('Processing event:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        await handleCheckoutComplete(session);
        break;
      }

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
        console.log('Unhandled event type: ' + event.type);
    }

    return res.status(200).json({ received: true });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}

async function handleCheckoutComplete(session) {
  console.log('Processing checkout.session.completed:', session.id);

  const customerId = session.customer;
  const customerEmail = session.customer_details?.email || session.customer_email;
  const subscriptionId = session.subscription;

  if (!subscriptionId || !customerEmail) {
    console.error('Missing subscriptionId or email in checkout session');
    return;
  }

  // Buscar subscription do Stripe para pegar datas
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  
  const currentPeriodEnd = await getCurrentPeriodEndDate(subscription);
  if (!currentPeriodEnd) {
    console.error('Could not determine expiration date from checkout subscription:', subscriptionId);
    return;
  }

  const isTrial = subscription.status === 'trialing';

  // Buscar usuário pelo email
  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('email', customerEmail.toLowerCase())
    .single();

  if (!user) {
    console.log('User not found for email:', customerEmail);
    return;
  }

  // Verificar se já existe licença
  const { data: existingLicense } = await supabase
    .from('licenses')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (existingLicense) {
    // Atualizar licença existente
    await supabase
      .from('licenses')
      .update({
        active: true,
        plan_type: isTrial ? 'trial' : 'monthly',
        expires_at: currentPeriodEnd.toISOString(),
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
      })
      .eq('id', existingLicense.id);

    console.log('License updated from checkout:', existingLicense.id);
  } else {
    // Criar nova licença
    await supabase
      .from('licenses')
      .insert({
        user_id: user.id,
        email: customerEmail.toLowerCase(),
        active: true,
        plan_type: isTrial ? 'trial' : 'monthly',
        expires_at: currentPeriodEnd.toISOString(),
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
      });

    console.log('New license created from checkout');
  }

  // Log do evento
  await supabase.from('event_logs').insert({
    event_type: 'checkout_completed',
    user_id: user.id,
    email: customerEmail.toLowerCase(),
    details: {
      checkout_session_id: session.id,
      subscription_id: subscriptionId,
      customer_id: customerId,
      is_trialing: isTrial,
      expires_at: currentPeriodEnd.toISOString(),
      fingerprint_registered: false,
    },
  });
}

async function handleSubscriptionUpdate(subscription) {
  console.log('Processing subscription update:', subscription.id);

  const customerId = subscription.customer;
  const subscriptionId = subscription.id;
  const status = subscription.status;
  
  // CORREÇÃO: Ignorar status "incomplete" para não sobrescrever "active"
  // Status "incomplete" significa que o pagamento ainda está processando
  // Não devemos desativar a licença nesse caso
  if (status === 'incomplete' || status === 'incomplete_expired') {
    console.log('Ignoring subscription update with status:', status);
    return;
  }
  
  // Validar current_period_end (com fallback via Stripe retrieve)
  const currentPeriodEnd = await getCurrentPeriodEndDate(subscription);

  // Validar canceled_at
  let canceledAt = null;
  if (subscription.canceled_at && !isNaN(subscription.canceled_at)) {
    const tempDate = new Date(subscription.canceled_at * 1000);
    if (!isNaN(tempDate.getTime())) {
      canceledAt = tempDate;
    }
  }

  // Se não tem data de expiração válida, não atualiza
  if (!currentPeriodEnd) {
    console.error('Invalid current_period_end for subscription:', subscriptionId, 'status=', status);
    return;
  }

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
  // active, trialing = licença ativa
  // past_due = ainda permite uso (Stripe vai tentar cobrar novamente)
  // canceled, unpaid = licença inativa
  const isActive = ['active', 'trialing', 'past_due'].includes(status);
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
      status: status,
      canceled_at: canceledAt ? canceledAt.toISOString() : null,
      expires_at: currentPeriodEnd.toISOString(),
    },
  });

  console.log('Subscription ' + subscriptionId + ' updated: status=' + status + ', active=' + isActive);
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

    console.log('License deactivated for canceled subscription:', subscriptionId);
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
        plan_type: 'monthly',
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

    console.log('Payment succeeded, license extended to ' + currentPeriodEnd);
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

    console.log('Payment failed for subscription ' + subscriptionId);
  }
}
