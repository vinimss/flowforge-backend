// api/pages.js - Landing Page, Privacy Policy, Terms of Service (COMBINED)
// Acesse: /api/pages (landing), /api/pages?p=privacy, /api/pages?p=terms

export default async function handler(req, res) {
  const page = req.query.p || 'home';
  
  // Detectar idioma
  const acceptLang = req.headers['accept-language'] || '';
  let lang = 'en';
  if (acceptLang.includes('pt')) lang = 'pt';
  else if (acceptLang.includes('es')) lang = 'es';

  if (page === 'privacy') {
    return servePrivacy(res, lang);
  } else if (page === 'terms') {
    return serveTerms(res, lang);
  } else {
    return serveLanding(res, lang);
  }
}

// ============================================
// LANDING PAGE
// ============================================
function serveLanding(res, lang) {
  const discordUrl = 'https://discord.com/invite/dURj8CgbR';

  const t = {
    en: {
      title: 'FlowForge Pro',
      tagline: 'Automate Your AI Video Generation',
      description: 'The ultimate Chrome extension for automating Google Flow video generation. Create hundreds of AI videos effortlessly while you focus on what matters.',
      watchDemo: 'Watch Demo',
      features: 'Features',
      feature1: 'Batch Processing',
      feature1Desc: 'Generate up to 500 videos in a single session with smart queue management',
      feature2: 'Smart Automation',
      feature2Desc: 'Intelligent delay system that adapts to avoid rate limits and maximize success',
      feature3: 'One-Click Download',
      feature3Desc: 'Download all generated videos with a single click, perfectly organized',
      feature4: 'Background Mode',
      feature4Desc: 'Works silently in the background while you focus on other tasks',
      howItWorks: 'How It Works',
      step1: 'Install Extension',
      step1Desc: 'Add FlowForge Pro to Chrome in seconds',
      step2: 'Paste Prompts',
      step2Desc: 'Add up to 500 prompts, one per line',
      step3: 'Start Automation',
      step3Desc: 'Click start and let FlowForge do the work',
      step4: 'Download All',
      step4Desc: 'Get all your videos with one click',
      pricing: 'Simple Pricing',
      trial: '1-Day Free Trial',
      trialDesc: 'Test all features before subscribing',
      monthly: '/month',
      afterTrial: 'after trial',
      unlimited: 'Unlimited video generation',
      priority: 'Priority support via Discord',
      updates: 'Free updates forever',
      cta: 'Start Free Trial',
      footer: '© 2025 FlowForge Pro. All rights reserved.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      support: 'Support',
      joinDiscord: 'Join Discord',
    },
    pt: {
      title: 'FlowForge Pro',
      tagline: 'Automatize Sua Geração de Vídeos com IA',
      description: 'A extensão definitiva para Chrome que automatiza a geração de vídeos no Google Flow. Crie centenas de vídeos com IA sem esforço enquanto foca no que importa.',
      watchDemo: 'Ver Demo',
      features: 'Recursos',
      feature1: 'Processamento em Lote',
      feature1Desc: 'Gere até 500 vídeos em uma única sessão com gerenciamento inteligente de fila',
      feature2: 'Automação Inteligente',
      feature2Desc: 'Sistema de delay inteligente que se adapta para evitar limites e maximizar sucesso',
      feature3: 'Download com Um Clique',
      feature3Desc: 'Baixe todos os vídeos gerados com um único clique, perfeitamente organizados',
      feature4: 'Modo em Segundo Plano',
      feature4Desc: 'Funciona silenciosamente em segundo plano enquanto você foca em outras tarefas',
      howItWorks: 'Como Funciona',
      step1: 'Instale a Extensão',
      step1Desc: 'Adicione o FlowForge Pro ao Chrome em segundos',
      step2: 'Cole os Prompts',
      step2Desc: 'Adicione até 500 prompts, um por linha',
      step3: 'Inicie a Automação',
      step3Desc: 'Clique em iniciar e deixe o FlowForge trabalhar',
      step4: 'Baixe Todos',
      step4Desc: 'Obtenha todos os seus vídeos com um clique',
      pricing: 'Preço Simples',
      trial: '1 Dia de Teste Grátis',
      trialDesc: 'Teste todos os recursos antes de assinar',
      monthly: '/mês',
      afterTrial: 'após o teste',
      unlimited: 'Geração ilimitada de vídeos',
      priority: 'Suporte prioritário via Discord',
      updates: 'Atualizações grátis para sempre',
      cta: 'Começar Teste Grátis',
      footer: '© 2025 FlowForge Pro. Todos os direitos reservados.',
      privacy: 'Política de Privacidade',
      terms: 'Termos de Uso',
      support: 'Suporte',
      joinDiscord: 'Entrar no Discord',
    },
    es: {
      title: 'FlowForge Pro',
      tagline: 'Automatiza Tu Generación de Videos con IA',
      description: 'La extensión definitiva para Chrome que automatiza la generación de videos en Google Flow. Crea cientos de videos con IA sin esfuerzo mientras te enfocas en lo que importa.',
      watchDemo: 'Ver Demo',
      features: 'Características',
      feature1: 'Procesamiento por Lotes',
      feature1Desc: 'Genera hasta 500 videos en una sola sesión con gestión inteligente de cola',
      feature2: 'Automatización Inteligente',
      feature2Desc: 'Sistema de retraso inteligente que se adapta para evitar límites y maximizar el éxito',
      feature3: 'Descarga con Un Clic',
      feature3Desc: 'Descarga todos los videos generados con un solo clic, perfectamente organizados',
      feature4: 'Modo en Segundo Plano',
      feature4Desc: 'Funciona silenciosamente en segundo plano mientras te enfocas en otras tareas',
      howItWorks: 'Cómo Funciona',
      step1: 'Instala la Extensión',
      step1Desc: 'Agrega FlowForge Pro a Chrome en segundos',
      step2: 'Pega los Prompts',
      step2Desc: 'Agrega hasta 500 prompts, uno por línea',
      step3: 'Inicia la Automatización',
      step3Desc: 'Haz clic en iniciar y deja que FlowForge trabaje',
      step4: 'Descarga Todo',
      step4Desc: 'Obtén todos tus videos con un clic',
      pricing: 'Precio Simple',
      trial: '1 Día de Prueba Gratis',
      trialDesc: 'Prueba todas las funciones antes de suscribirte',
      monthly: '/mes',
      afterTrial: 'después de la prueba',
      unlimited: 'Generación ilimitada de videos',
      priority: 'Soporte prioritario vía Discord',
      updates: 'Actualizaciones gratis para siempre',
      cta: 'Empezar Prueba Gratis',
      footer: '© 2025 FlowForge Pro. Todos los derechos reservados.',
      privacy: 'Política de Privacidad',
      terms: 'Términos de Servicio',
      support: 'Soporte',
      joinDiscord: 'Unirse a Discord',
    }
  };

  const i = t[lang];

  const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${i.title} - ${i.tagline}</title>
    <meta name="description" content="${i.description}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg: #0a0a0f;
            --bg-card: #1a1a25;
            --accent: #8b5cf6;
            --accent-glow: rgba(139, 92, 246, 0.4);
            --text: #f8fafc;
            --text-muted: #94a3b8;
            --border: rgba(255,255,255,0.08);
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Outfit', sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; }
        
        .bg-glow {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1;
            background: radial-gradient(ellipse at 30% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
                        radial-gradient(ellipse at 70% 80%, rgba(6, 182, 212, 0.1) 0%, transparent 50%);
        }
        
        header {
            position: fixed; top: 0; left: 0; right: 0; z-index: 100;
            padding: 16px 40px; backdrop-filter: blur(20px);
            background: rgba(10, 10, 15, 0.85); border-bottom: 1px solid var(--border);
        }
        nav { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
        .logo { display: flex; align-items: center; gap: 12px; text-decoration: none; }
        .logo-icon {
            width: 40px; height: 40px; background: linear-gradient(135deg, #8b5cf6, #06b6d4);
            border-radius: 10px; display: flex; align-items: center; justify-content: center;
            font-weight: 800; font-size: 14px; color: white;
        }
        .logo-text { font-size: 20px; font-weight: 700; color: var(--text); }
        .nav-links { display: flex; gap: 24px; list-style: none; align-items: center; }
        .nav-links a { color: var(--text-muted); text-decoration: none; font-weight: 500; font-size: 14px; transition: color 0.3s; }
        .nav-links a:hover { color: var(--text); }
        .discord-btn {
            display: flex; align-items: center; gap: 8px; background: #5865F2;
            padding: 10px 16px; border-radius: 8px; color: white !important; font-weight: 600;
        }
        .discord-btn:hover { background: #4752C4; }
        
        .hero {
            min-height: 100vh; display: flex; align-items: center; justify-content: center;
            padding: 120px 40px 80px; text-align: center;
        }
        .hero-content { max-width: 700px; }
        .badge {
            display: inline-block; background: rgba(139, 92, 246, 0.15);
            border: 1px solid rgba(139, 92, 246, 0.3); padding: 8px 16px;
            border-radius: 100px; font-size: 13px; color: #a78bfa; margin-bottom: 24px;
        }
        h1 { font-size: 48px; font-weight: 800; line-height: 1.1; margin-bottom: 20px; }
        h1 span { background: linear-gradient(135deg, #8b5cf6, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero p { font-size: 18px; color: var(--text-muted); margin-bottom: 32px; }
        .btn-group { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
        .btn {
            display: inline-flex; align-items: center; gap: 10px; padding: 16px 28px;
            border-radius: 12px; font-size: 16px; font-weight: 600; text-decoration: none;
            transition: all 0.3s; cursor: pointer; border: none;
        }
        .btn-primary { background: linear-gradient(135deg, #8b5cf6, #06b6d4); color: white; box-shadow: 0 4px 20px var(--accent-glow); }
        .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 8px 30px var(--accent-glow); }
        .btn-secondary { background: var(--bg-card); color: var(--text); border: 1px solid var(--border); }
        .btn-secondary:hover { border-color: var(--accent); }
        
        section { padding: 80px 40px; max-width: 1200px; margin: 0 auto; }
        .section-title { text-align: center; margin-bottom: 48px; }
        .section-title h2 { font-size: 36px; font-weight: 700; }
        
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px; }
        .feature-card {
            background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px;
            padding: 28px; transition: all 0.3s;
        }
        .feature-card:hover { transform: translateY(-4px); border-color: rgba(139, 92, 246, 0.3); }
        .feature-icon {
            width: 48px; height: 48px; background: rgba(139, 92, 246, 0.15);
            border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px;
        }
        .feature-icon svg { width: 24px; height: 24px; stroke: #a78bfa; }
        .feature-card h3 { font-size: 18px; margin-bottom: 8px; }
        .feature-card p { color: var(--text-muted); font-size: 14px; }
        
        .steps-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 32px; }
        .step { text-align: center; }
        .step-num {
            width: 50px; height: 50px; background: linear-gradient(135deg, #8b5cf6, #06b6d4);
            border-radius: 50%; display: flex; align-items: center; justify-content: center;
            font-size: 20px; font-weight: 700; margin: 0 auto 16px;
        }
        .step h3 { font-size: 16px; margin-bottom: 8px; }
        .step p { color: var(--text-muted); font-size: 14px; }
        
        .pricing-card {
            max-width: 400px; margin: 0 auto; background: var(--bg-card);
            border: 2px solid var(--accent); border-radius: 20px; padding: 40px; text-align: center;
        }
        .pricing-badge {
            display: inline-block; background: linear-gradient(135deg, #8b5cf6, #06b6d4);
            padding: 6px 14px; border-radius: 100px; font-size: 12px; font-weight: 600;
            text-transform: uppercase; margin-bottom: 16px;
        }
        .pricing-price { font-size: 56px; font-weight: 800; margin: 16px 0; }
        .pricing-price span { font-size: 18px; color: var(--text-muted); }
        .pricing-list { list-style: none; text-align: left; margin: 24px 0; }
        .pricing-list li { display: flex; align-items: center; gap: 10px; padding: 12px 0; border-bottom: 1px solid var(--border); color: var(--text-muted); }
        .pricing-list svg { width: 20px; height: 20px; stroke: #10b981; flex-shrink: 0; }
        
        footer {
            padding: 40px; border-top: 1px solid var(--border); text-align: center;
        }
        .footer-links { display: flex; gap: 24px; justify-content: center; margin-bottom: 16px; flex-wrap: wrap; }
        .footer-links a { color: var(--text-muted); text-decoration: none; font-size: 14px; }
        .footer-links a:hover { color: var(--text); }
        .footer-copy { color: #64748b; font-size: 14px; }
        
        @media (max-width: 768px) {
            header { padding: 16px 20px; }
            .nav-links { display: none; }
            .hero { padding: 100px 20px 60px; }
            h1 { font-size: 32px; }
            section { padding: 60px 20px; }
        }
    </style>
</head>
<body>
    <div class="bg-glow"></div>
    
    <header>
        <nav>
            <a href="/api/pages" class="logo">
                <div class="logo-icon">FF</div>
                <span class="logo-text">${i.title}</span>
            </a>
            <ul class="nav-links">
                <li><a href="#features">${i.features}</a></li>
                <li><a href="#pricing">${i.pricing}</a></li>
                <li><a href="/api/pages?p=privacy">${i.privacy}</a></li>
                <li><a href="/api/pages?p=terms">${i.terms}</a></li>
                <li><a href="${discordUrl}" target="_blank" class="discord-btn">${i.joinDiscord}</a></li>
            </ul>
        </nav>
    </header>

    <section class="hero">
        <div class="hero-content">
            <div class="badge">Chrome Extension • VEO AI Automator</div>
            <h1>${i.tagline.split(' ').slice(0, -2).join(' ')} <span>${i.tagline.split(' ').slice(-2).join(' ')}</span></h1>
            <p>${i.description}</p>
            <div class="btn-group">
                <a href="#pricing" class="btn btn-primary">${i.cta}</a>
                <a href="${discordUrl}" target="_blank" class="btn btn-secondary">${i.joinDiscord}</a>
            </div>
        </div>
    </section>

    <section id="features">
        <div class="section-title"><h2>${i.features}</h2></div>
        <div class="features-grid">
            <div class="feature-card">
                <div class="feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg></div>
                <h3>${i.feature1}</h3>
                <p>${i.feature1Desc}</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg></div>
                <h3>${i.feature2}</h3>
                <p>${i.feature2Desc}</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></div>
                <h3>${i.feature3}</h3>
                <p>${i.feature3Desc}</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg></div>
                <h3>${i.feature4}</h3>
                <p>${i.feature4Desc}</p>
            </div>
        </div>
    </section>

    <section id="how">
        <div class="section-title"><h2>${i.howItWorks}</h2></div>
        <div class="steps-grid">
            <div class="step"><div class="step-num">1</div><h3>${i.step1}</h3><p>${i.step1Desc}</p></div>
            <div class="step"><div class="step-num">2</div><h3>${i.step2}</h3><p>${i.step2Desc}</p></div>
            <div class="step"><div class="step-num">3</div><h3>${i.step3}</h3><p>${i.step3Desc}</p></div>
            <div class="step"><div class="step-num">4</div><h3>${i.step4}</h3><p>${i.step4Desc}</p></div>
        </div>
    </section>

    <section id="pricing">
        <div class="section-title"><h2>${i.pricing}</h2></div>
        <div class="pricing-card">
            <div class="pricing-badge">${i.trial}</div>
            <h3>FlowForge Pro</h3>
            <div class="pricing-price">$9.90 <span>${i.monthly}</span></div>
            <p style="color: var(--text-muted); margin-bottom: 24px;">${i.afterTrial}</p>
            <ul class="pricing-list">
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>${i.unlimited}</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>${i.feature1} (500+)</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>${i.feature3}</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>${i.priority}</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>${i.updates}</li>
            </ul>
            <a href="#" class="btn btn-primary" style="width: 100%; justify-content: center;">${i.cta}</a>
        </div>
    </section>

    <footer>
        <div class="footer-links">
            <a href="/api/pages?p=privacy">${i.privacy}</a>
            <a href="/api/pages?p=terms">${i.terms}</a>
            <a href="${discordUrl}" target="_blank">${i.support} (Discord)</a>
        </div>
        <p class="footer-copy">${i.footer}</p>
    </footer>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  return res.status(200).send(html);
}

// ============================================
// PRIVACY POLICY
// ============================================
function servePrivacy(res, lang) {
  const t = {
    en: {
      title: 'Privacy Policy',
      lastUpdate: 'Last updated: January 2025',
      intro: 'FlowForge Pro is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information.',
      sections: [
        { title: '1. Information We Collect', content: 'We collect: Account information (email, encrypted password), Payment information (processed by Stripe - we never store card details), Usage data (anonymous statistics), Device fingerprint (to prevent trial abuse).' },
        { title: '2. How We Use Your Information', content: 'We use your information to: Provide and maintain our service, Process payments, Send important updates, Prevent fraud, Improve our product.' },
        { title: '3. Data Security', content: 'Your data is stored securely using: Supabase for database, Stripe for PCI-compliant payments, HTTPS encryption, Hashed passwords.' },
        { title: '4. Data Sharing', content: 'We do not sell your data. We only share with: Stripe (payments), Service providers (under confidentiality agreements), Legal requirements.' },
        { title: '5. Your Rights', content: 'You can: Access your data, Correct inaccurate data, Delete your account, Export your data. Contact: support@flowforge.pro' },
        { title: '6. Contact', content: 'Questions? Email us at support@flowforge.pro' }
      ],
      back: '← Back to Home'
    },
    pt: {
      title: 'Política de Privacidade',
      lastUpdate: 'Última atualização: Janeiro de 2025',
      intro: 'FlowForge Pro está comprometido em proteger sua privacidade. Esta Política explica como coletamos, usamos e protegemos suas informações.',
      sections: [
        { title: '1. Informações que Coletamos', content: 'Coletamos: Informações da conta (email, senha criptografada), Informações de pagamento (processadas pelo Stripe - nunca armazenamos dados do cartão), Dados de uso (estatísticas anônimas), Fingerprint do dispositivo (para prevenir abuso do trial).' },
        { title: '2. Como Usamos Suas Informações', content: 'Usamos suas informações para: Fornecer e manter nosso serviço, Processar pagamentos, Enviar atualizações importantes, Prevenir fraudes, Melhorar nosso produto.' },
        { title: '3. Segurança de Dados', content: 'Seus dados são armazenados com segurança usando: Supabase para banco de dados, Stripe para pagamentos PCI-compliant, Criptografia HTTPS, Senhas com hash.' },
        { title: '4. Compartilhamento de Dados', content: 'Não vendemos seus dados. Compartilhamos apenas com: Stripe (pagamentos), Provedores de serviço (sob acordos de confidencialidade), Requisitos legais.' },
        { title: '5. Seus Direitos', content: 'Você pode: Acessar seus dados, Corrigir dados imprecisos, Excluir sua conta, Exportar seus dados. Contato: suporte@flowforge.pro' },
        { title: '6. Contato', content: 'Dúvidas? Email: suporte@flowforge.pro' }
      ],
      back: '← Voltar para Início'
    },
    es: {
      title: 'Política de Privacidad',
      lastUpdate: 'Última actualización: Enero de 2025',
      intro: 'FlowForge Pro está comprometido con la protección de tu privacidad. Esta Política explica cómo recopilamos, usamos y protegemos tu información.',
      sections: [
        { title: '1. Información que Recopilamos', content: 'Recopilamos: Información de cuenta (email, contraseña cifrada), Información de pago (procesada por Stripe - nunca almacenamos datos de tarjeta), Datos de uso (estadísticas anónimas), Huella del dispositivo (para prevenir abuso del trial).' },
        { title: '2. Cómo Usamos Tu Información', content: 'Usamos tu información para: Proporcionar y mantener nuestro servicio, Procesar pagos, Enviar actualizaciones importantes, Prevenir fraudes, Mejorar nuestro producto.' },
        { title: '3. Seguridad de Datos', content: 'Tus datos se almacenan de forma segura usando: Supabase para base de datos, Stripe para pagos PCI-compliant, Cifrado HTTPS, Contraseñas con hash.' },
        { title: '4. Compartición de Datos', content: 'No vendemos tus datos. Solo compartimos con: Stripe (pagos), Proveedores de servicio (bajo acuerdos de confidencialidad), Requisitos legales.' },
        { title: '5. Tus Derechos', content: 'Puedes: Acceder a tus datos, Corregir datos inexactos, Eliminar tu cuenta, Exportar tus datos. Contacto: soporte@flowforge.pro' },
        { title: '6. Contacto', content: '¿Preguntas? Email: soporte@flowforge.pro' }
      ],
      back: '← Volver al Inicio'
    }
  };

  const i = t[lang];
  const html = generateLegalPage(i, lang, 'privacy');
  res.setHeader('Content-Type', 'text/html');
  return res.status(200).send(html);
}

// ============================================
// TERMS OF SERVICE
// ============================================
function serveTerms(res, lang) {
  const t = {
    en: {
      title: 'Terms of Service',
      lastUpdate: 'Last updated: January 2025',
      intro: 'Please read these Terms carefully before using FlowForge Pro.',
      sections: [
        { title: '1. Acceptance', content: 'By using our Service, you agree to these Terms. If you disagree, do not use the Service.' },
        { title: '2. Description', content: 'FlowForge Pro is a Chrome extension that automates video generation on Google Flow. It requires a paid subscription after the free trial.' },
        { title: '3. Account', content: 'You must: Create an account with valid email, Provide accurate information, Maintain security of your credentials, Notify us of unauthorized use.' },
        { title: '4. Trial & Subscription', content: 'Free Trial: 1-day, one-time only per device. Subscription: $9.90 USD/month after trial. Cancellation: Anytime via Stripe portal, access continues until period end.' },
        { title: '5. Acceptable Use', content: 'You agree NOT to: Share credentials, Create multiple accounts, Bypass anti-fraud systems, Use for illegal purposes, Reverse engineer the code, Resell access.' },
        { title: '6. Disclaimer', content: 'Service provided "AS IS". We do not guarantee uninterrupted service or that videos will always generate successfully. Google may change their service at any time.' },
        { title: '7. Refund Policy', content: 'No refunds for subscription fees. Cancellation stops future charges but does not refund past payments. Contact support within 7 days for technical issues.' },
        { title: '8. Contact', content: 'Questions? Email: support@flowforge.pro' }
      ],
      back: '← Back to Home'
    },
    pt: {
      title: 'Termos de Uso',
      lastUpdate: 'Última atualização: Janeiro de 2025',
      intro: 'Por favor, leia estes Termos cuidadosamente antes de usar o FlowForge Pro.',
      sections: [
        { title: '1. Aceitação', content: 'Ao usar nosso Serviço, você concorda com estes Termos. Se discordar, não use o Serviço.' },
        { title: '2. Descrição', content: 'FlowForge Pro é uma extensão Chrome que automatiza a geração de vídeos no Google Flow. Requer assinatura paga após o teste gratuito.' },
        { title: '3. Conta', content: 'Você deve: Criar conta com email válido, Fornecer informações precisas, Manter segurança das credenciais, Nos notificar de uso não autorizado.' },
        { title: '4. Trial e Assinatura', content: 'Teste Grátis: 1 dia, único por dispositivo. Assinatura: $9,90 USD/mês após teste. Cancelamento: A qualquer momento via portal Stripe, acesso continua até fim do período.' },
        { title: '5. Uso Aceitável', content: 'Você concorda em NÃO: Compartilhar credenciais, Criar múltiplas contas, Burlar sistemas antifraude, Usar para fins ilegais, Fazer engenharia reversa, Revender acesso.' },
        { title: '6. Isenção', content: 'Serviço fornecido "COMO ESTÁ". Não garantimos serviço ininterrupto ou que vídeos sempre serão gerados com sucesso. Google pode mudar seu serviço a qualquer momento.' },
        { title: '7. Política de Reembolso', content: 'Sem reembolso para taxas de assinatura. Cancelamento para cobranças futuras, não reembolsa pagamentos anteriores. Contate suporte em até 7 dias para problemas técnicos.' },
        { title: '8. Contato', content: 'Dúvidas? Email: suporte@flowforge.pro' }
      ],
      back: '← Voltar para Início'
    },
    es: {
      title: 'Términos de Servicio',
      lastUpdate: 'Última actualización: Enero de 2025',
      intro: 'Por favor, lee estos Términos cuidadosamente antes de usar FlowForge Pro.',
      sections: [
        { title: '1. Aceptación', content: 'Al usar nuestro Servicio, aceptas estos Términos. Si no estás de acuerdo, no uses el Servicio.' },
        { title: '2. Descripción', content: 'FlowForge Pro es una extensión Chrome que automatiza la generación de videos en Google Flow. Requiere suscripción de pago después de la prueba gratuita.' },
        { title: '3. Cuenta', content: 'Debes: Crear cuenta con email válido, Proporcionar información precisa, Mantener seguridad de credenciales, Notificarnos de uso no autorizado.' },
        { title: '4. Trial y Suscripción', content: 'Prueba Gratis: 1 día, única por dispositivo. Suscripción: $9,90 USD/mes después de prueba. Cancelación: En cualquier momento vía portal Stripe, acceso continúa hasta fin del período.' },
        { title: '5. Uso Aceptable', content: 'Aceptas NO: Compartir credenciales, Crear múltiples cuentas, Eludir sistemas antifraude, Usar para fines ilegales, Hacer ingeniería inversa, Revender acceso.' },
        { title: '6. Descargo', content: 'Servicio proporcionado "TAL CUAL". No garantizamos servicio ininterrumpido o que videos siempre se generarán con éxito. Google puede cambiar su servicio en cualquier momento.' },
        { title: '7. Política de Reembolso', content: 'Sin reembolsos para tarifas de suscripción. Cancelación detiene cargos futuros, no reembolsa pagos anteriores. Contacta soporte en 7 días para problemas técnicos.' },
        { title: '8. Contacto', content: '¿Preguntas? Email: soporte@flowforge.pro' }
      ],
      back: '← Volver al Inicio'
    }
  };

  const i = t[lang];
  const html = generateLegalPage(i, lang, 'terms');
  res.setHeader('Content-Type', 'text/html');
  return res.status(200).send(html);
}

// ============================================
// LEGAL PAGE TEMPLATE
// ============================================
function generateLegalPage(i, lang, type) {
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${i.title} - FlowForge Pro</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root { --bg: #0a0a0f; --bg-card: #1a1a25; --accent: #8b5cf6; --text: #f8fafc; --text-muted: #94a3b8; --border: rgba(255,255,255,0.08); }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Outfit', sans-serif; background: var(--bg); color: var(--text); line-height: 1.8; }
        .container { max-width: 800px; margin: 0 auto; padding: 60px 24px; }
        .back { color: #a78bfa; text-decoration: none; font-size: 14px; display: inline-block; margin-bottom: 40px; }
        .back:hover { color: var(--text); }
        h1 { font-size: 36px; font-weight: 700; margin-bottom: 8px; }
        .date { color: #64748b; font-size: 14px; margin-bottom: 32px; }
        .intro { font-size: 18px; color: var(--text-muted); margin-bottom: 40px; padding-bottom: 24px; border-bottom: 1px solid var(--border); }
        .section { margin-bottom: 32px; }
        .section h2 { font-size: 20px; font-weight: 600; margin-bottom: 12px; }
        .section p { color: var(--text-muted); }
        footer { margin-top: 48px; padding-top: 24px; border-top: 1px solid var(--border); text-align: center; color: #64748b; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <a href="/api/pages" class="back">${i.back}</a>
        <h1>${i.title}</h1>
        <p class="date">${i.lastUpdate}</p>
        <p class="intro">${i.intro}</p>
        ${i.sections.map(s => `<div class="section"><h2>${s.title}</h2><p>${s.content}</p></div>`).join('')}
        <footer>© 2025 FlowForge Pro. All rights reserved.</footer>
    </div>
</body>
</html>`;
}
