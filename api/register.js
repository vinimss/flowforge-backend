import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function normalizeEmail(e) {
  return String(e || "").trim().toLowerCase();
}

// ============================================
// LISTA DE DOMÍNIOS DE EMAIL TEMPORÁRIO
// ============================================
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  "tempmail.com", "temp-mail.org", "tempmailo.com", "tempr.email",
  "mailinator.com", "mailinator2.com", "mailinater.com",
  "guerrillamail.com", "guerrillamail.org", "guerrillamail.net", "guerrillamail.biz",
  "sharklasers.com", "grr.la", "guerrillamailblock.com",
  "10minutemail.com", "10minutemail.net", "10minmail.com", "10mail.org",
  "throwaway.email", "throwawaymail.com", "throam.com",
  "yopmail.com", "yopmail.fr", "yopmail.net",
  "fakeinbox.com", "fakemailgenerator.com", "fakemail.fr",
  "trashmail.com", "trashmail.net", "trashmail.org", "trash-mail.com",
  "getnada.com", "nada.email",
  "maildrop.cc", "mailnesia.com", "mailcatch.com",
  "dispostable.com", "disposableemailaddresses.com",
  "getairmail.com", "mohmal.com", "tempail.com",
  "burnermail.io", "burner.kiwi",
  "mailsac.com", "inboxkitten.com",
  "emailondeck.com", "spamgourmet.com",
  "mintemail.com", "mytemp.email",
  "discard.email", "discardmail.com",
  "spamex.com", "spamfree24.org",
  "mailnull.com", "e4ward.com",
  "incognitomail.com", "incognitomail.org",
  "anonymbox.com", "anonymmail.net",
  "mailforspam.com", "spam4.me",
  "binkmail.com", "safetymail.info",
  "filzmail.com", "trashymail.com",
  "tempomail.fr", "tmpmail.org", "tmpmail.net",
  "crazymailing.com", "maileater.com",
  "mailexpire.com", "mailmoat.com",
  "20mail.it", "20minutemail.com",
  "33mail.com", "abyssmail.com",
  "anonbox.net", "antispam.de",
  "boun.cr", "bugmenot.com",
  "cool.fr.nf", "deadaddress.com",
  "despam.it", "devnullmail.com",
  "dodgeit.com", "dodgemail.de",
  "emailigo.de", "emailinfive.com",
  "emailsensei.com", "emailtemporanea.com",
  "emailwarden.com", "ephemail.net",
  "explodemail.com", "fastacura.com",
  "flyspam.com", "frapmail.com",
  "garliclife.com", "ghosttexter.de",
  "gishpuppy.com", "grandmamail.com",
  "haltospam.com", "hatespam.org",
  "hidemail.de", "hmamail.com",
  "ieatspam.eu", "ieatspam.info",
  "ihateyoualot.info", "imails.info",
  "inboxalias.com", "inboxclean.com",
  "instantemailaddress.com", "jetable.com",
  "jetable.org", "kasmail.com",
  "killmail.com", "killmail.net",
  "klassmaster.com", "kurzepost.de",
  "letthemeatspam.com", "litedrop.com",
  "lookugly.com", "lortemail.dk",
  "mailbidon.com", "mailblocks.com",
  "mailde.de", "maileimer.de",
  "mailfreeonline.com", "mailguard.me",
  "mailin8r.com", "mailismagic.com",
  "mailme24.com", "mailmetrash.com",
  "mailnator.com", "mailquack.com",
  "mailseal.de", "mailshell.com",
  "mailsiphon.com", "mailslite.com",
  "mailzilla.com", "meltmail.com",
  "mintemail.com", "mytrashmail.com",
  "nervmich.net", "neverbox.com",
  "no-spam.ws", "nobulk.com",
  "noclickemail.com", "nogmailspam.info",
  "nomail2me.com", "nomorespamemails.com",
  "nospam4.us", "nospamfor.us",
  "nospammail.net", "nospamthanks.info",
  "notmailinator.com", "nowhere.org",
  "nowmymail.com", "objectmail.com",
  "oneoffemail.com", "otherinbox.com",
  "owlpic.com", "pookmail.com",
  "privacy.net", "proxymail.eu",
  "putthisinyourspamdatabase.com", "quickinbox.com",
  "rejectmail.com", "rhyta.com",
  "rtrtr.com", "safe-mail.net",
  "safersignup.de", "safetypost.de",
  "saynotospams.com", "selfdestructingmail.com",
  "sendspamhere.com", "shiftmail.com",
  "shitmail.me", "shortmail.net",
  "sinnlos-mail.de", "slaskpost.se",
  "smashmail.de", "smellfear.com",
  "sneakemail.com", "sofort-mail.de",
  "sogetthis.com", "spam.la",
  "spam.su", "spamail.de",
  "spamavert.com", "spambob.com",
  "spambog.com", "spambox.info",
  "spambox.us", "spamcannon.com",
  "spamcero.com", "spamcon.org",
  "spamcowboy.com", "spamday.com",
  "spamfree.eu", "spamfree24.com",
  "spamgoes.in", "spamgourmet.com",
  "spamherelots.com", "spamhole.com",
  "spamify.com", "spaml.com",
  "spammotel.com", "spamobox.com",
  "spamspot.com", "spamthis.co.uk",
  "spamtroll.net", "spoofmail.de",
  "stop-my-spam.com", "stuffmail.de",
  "superrito.com", "techemail.com",
  "teleworm.com", "teleworm.us",
  "tempalias.com", "tempe-mail.com",
  "tempemail.com", "tempemail.net",
  "tempinbox.com", "tempmail.co",
  "tempmail.de", "tempmail.eu",
  "tempmail.net", "tempmail2.com",
  "tempomail.fr", "temporarily.de",
  "temporaryemail.net", "temporaryemail.us",
  "temporaryinbox.com", "thankyou2010.com",
  "thisisnotmyrealemail.com", "throwawayemailaddress.com",
  "tilien.com", "tmailinator.com",
  "trashcanmail.com", "trashdevil.com",
  "trashemail.de", "trashmail.at",
  "trashmail.me", "trashmail.ws",
  "trashmailer.com", "trbvm.com",
  "trickmail.net", "trollbot.org",
  "turual.com", "twinmail.de",
  "uggsrock.com", "upliftnow.com",
  "uroid.com", "veryrealemail.com",
  "vomoto.com", "wegwerf-email.de",
  "wegwerfemail.com", "wegwerfemail.de",
  "wegwerfmail.de", "wegwerfmail.net",
  "wetrainbayarea.com", "whyspam.me",
  "willselfdestruct.com", "xoxy.net",
  "yapped.net", "yogamaven.com",
  "zehnminutenmail.de", "zippymail.info"
]);

function isDisposableEmail(email) {
  const parts = String(email || "").split("@");
  if (parts.length !== 2) return false;
  const domain = parts[1].toLowerCase();
  return DISPOSABLE_EMAIL_DOMAINS.has(domain);
}

const COMMON_DOMAIN_TYPOS = {
  "hotmails.com": "hotmail.com", "hotmail.con": "hotmail.com", "hotmai.com": "hotmail.com",
  "gmal.com": "gmail.com", "gmial.com": "gmail.com", "gmai.com": "gmail.com", "gmail.con": "gmail.com",
  "outlok.com": "outlook.com", "outllok.com": "outlook.com", "outlook.con": "outlook.com",
  "yaho.com": "yahoo.com", "yahho.com": "yahoo.com", "yahoo.con": "yahoo.com",
  "iclud.com": "icloud.com", "icould.com": "icloud.com", "icloud.con": "icloud.com",
  "live.con": "live.com", "msn.con": "msn.com"
};

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

// Helper para resposta com CORS
function jsonResponse(res, status, data) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.status(status).json(data);
}

export default async function handler(req, res) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return jsonResponse(res, 405, { error: 'Method not allowed', ok: false });
  }

  try {
    const { email, password, fingerprint, terms_accepted } = req.body || {};

    const emailNorm = normalizeEmail(email);
    
    // Validar formato do email
    if (!EMAIL_RE.test(emailNorm)) {
      return jsonResponse(res, 400, { ok: false, error: "Invalid email format" });
    }

    // Verificar typo no domínio
    const suggestedDomain = suggestEmailDomainFix(emailNorm);
    if (suggestedDomain) {
      return jsonResponse(res, 400, { 
        ok: false, 
        error: "Email domain looks wrong", 
        code: "EMAIL_DOMAIN_TYPO", 
        suggestion: suggestedDomain 
      });
    }

    // ============================================
    // PROTEÇÃO 1: Bloquear emails temporários
    // ============================================
    if (isDisposableEmail(emailNorm)) {
      return jsonResponse(res, 400, { 
        ok: false, 
        error: "Temporary/disposable emails are not allowed. Please use a real email address.",
        code: "DISPOSABLE_EMAIL"
      });
    }

    if (!email || !password) {
      return jsonResponse(res, 400, { error: 'Email and password are required', ok: false });
    }

    if (password.length < 6) {
      return jsonResponse(res, 400, { error: 'Password must be at least 6 characters', ok: false });
    }

    if (!terms_accepted) {
      return jsonResponse(res, 400, { error: 'You must accept the terms and conditions', ok: false });
    }

    const emailLower = email.toLowerCase().trim();
    const ipAddress = req.headers['x-forwarded-for']?.split(',')[0]?.trim()
      || req.headers['x-real-ip']
      || 'unknown';

    // ============================================
    // PROTEÇÃO 2: Verificar IP bloqueado
    // ============================================
    const { data: blockedIp } = await supabase
      .from('blocked_ips')
      .select('id')
      .eq('ip_address', ipAddress)
      .single();

    if (blockedIp) {
      await supabase.from('event_logs').insert({
        event_type: 'blocked_ip_attempt',
        ip_address: ipAddress,
        email: emailLower,
        details: {
          reason: 'ip_in_blocklist',
          blocked_at: new Date().toISOString(),
        },
      });

      return jsonResponse(res, 400, { 
        ok: false, 
        error: "Registration is not available from this network. Please subscribe to continue.",
        code: "IP_BLOCKED"
      });
    }

    // ============================================
    // PROTEÇÃO 3: Bloquear fingerprint que já usou trial
    // ============================================
    if (fingerprint) {
      // Contar quantas vezes este fingerprint tentou usar trial
      const { data: fingerprintAttempts, error: countError } = await supabase
        .from('used_trial_fingerprints')
        .select('id, ip_address')
        .eq('fingerprint', fingerprint);

      const attemptCount = fingerprintAttempts?.length || 0;

      if (attemptCount > 0) {
        // Já usou trial com este fingerprint
        
        // Se já tentou 5+ vezes, bloqueia o IP também
        if (attemptCount >= 4) {
          // Adicionar IP à blocklist
          try {
            await supabase.from('blocked_ips').insert({
              ip_address: ipAddress,
              reason: 'excessive_trial_abuse',
              fingerprint: fingerprint,
              attempt_count: attemptCount + 1,
              created_at: new Date().toISOString(),
            });
          } catch (e) { /* Ignora se já existe */ }

          await supabase.from('event_logs').insert({
            event_type: 'ip_blocked_for_abuse',
            ip_address: ipAddress,
            email: emailLower,
            details: {
              reason: 'fingerprint_exceeded_5_attempts',
              fingerprint: fingerprint,
              attempt_count: attemptCount + 1,
              blocked_at: new Date().toISOString(),
            },
          });
        }

        // Registrar mais uma tentativa
        try {
          await supabase.from('used_trial_fingerprints').insert({
            fingerprint: fingerprint,
            user_id: null, // Não criou conta
            ip_address: ipAddress,
            is_blocked_attempt: true,
            created_at: new Date().toISOString(),
          });
        } catch (e) { /* Ignora erro */ }

        // Log tentativa de abuso
        await supabase.from('event_logs').insert({
          event_type: 'trial_abuse_blocked',
          ip_address: ipAddress,
          email: emailLower,
          details: {
            reason: 'fingerprint_already_used_trial',
            fingerprint: fingerprint,
            attempt_number: attemptCount + 1,
            blocked_at: new Date().toISOString(),
          },
        });

        return jsonResponse(res, 400, { 
          ok: false, 
          error: "A free trial has already been used on this device. Please subscribe to continue.",
          code: "TRIAL_ALREADY_USED"
        });
      }
    }

    // Check if already registered in our users table
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', emailLower)
      .single();

    if (existingUser) {
      return jsonResponse(res, 400, { error: 'Email already registered', ok: false });
    }

    // 1) Create user in Supabase Auth (needed for password reset emails)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: emailLower,
      password,
      email_confirm: true,
    });

    if (authError || !authData?.user?.id) {
      console.error('Error creating auth user:', authError);
      return jsonResponse(res, 400, { error: authError?.message || 'Failed to create user', ok: false });
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
      await supabase.auth.admin.deleteUser(userId);
      return jsonResponse(res, 500, { error: 'Failed to create user', ok: false });
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

    // ============================================
    // CRIAR LICENÇA TRIAL DE 1 DIA
    // ============================================
    const trialExpiresAt = new Date();
    trialExpiresAt.setDate(trialExpiresAt.getDate() + 1); // +1 dia

    const { error: licenseError } = await supabase
      .from('licenses')
      .insert({
        user_id: userId,
        email: emailLower,
        plan_type: 'trial',
        active: true,
        trial_used: true,
        expires_at: trialExpiresAt.toISOString(),
        created_at: new Date().toISOString(),
      });

    if (licenseError) {
      console.error('Error creating trial license:', licenseError);
    }

    // ============================================
    // SALVAR FINGERPRINT NA LISTA DE USADOS
    // ============================================
    if (fingerprint) {
      try {
        await supabase.from('used_trial_fingerprints').insert({
          fingerprint: fingerprint,
          user_id: userId,
          ip_address: ipAddress,
          created_at: new Date().toISOString(),
        });
      } catch (err) {
        console.log('Note: Could not save fingerprint:', err?.message);
      }
    }

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
        trial_created: !licenseError,
        trial_expires_at: trialExpiresAt.toISOString(),
      },
    });

    // Calcular dias restantes do trial
    const now = new Date();
    const daysLeft = Math.ceil((trialExpiresAt - now) / (1000 * 60 * 60 * 24));

    res.setHeader('Access-Control-Allow-Origin', '*');
    return jsonResponse(res, 200, {
      ok: true,
      user: { id: userId, email: emailLower },
      token: sessionToken,
      needs_checkout: false,
      has_license: true,
      license: {
        status: 'active',
        plan_type: 'trial',
        expires_at: trialExpiresAt.toISOString(),
        days_left: daysLeft,
        trial_used: true,
      },
    });

  } catch (error) {
    console.error('Error in register:', error);
    return jsonResponse(res, 500, { error: 'Internal server error', ok: false });
  }
}
