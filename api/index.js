// api/index.js - FlowForge Pro Landing Page v2
// Com imagens da extensão, vídeo demo e Discord
export default async function handler(req, res) {
  // Detectar idioma
  const acceptLang = req.headers['accept-language'] || '';
  let lang = 'en';
  if (acceptLang.includes('pt')) lang = 'pt';
  else if (acceptLang.includes('es')) lang = 'es';

  // URL do Discord
  const discordUrl = 'https://discord.com/invite/dURj8CgbR';

  // Traduções
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
      ctaLink: 'Install from Chrome Web Store',
      footer: '© 2025 FlowForge Pro. All rights reserved.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      support: 'Support',
      joinDiscord: 'Join Discord',
      interface: 'Clean, intuitive interface',
      multiLang: 'Available in English, Portuguese & Spanish'
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
      ctaLink: 'Instalar da Chrome Web Store',
      footer: '© 2025 FlowForge Pro. Todos os direitos reservados.',
      privacy: 'Política de Privacidade',
      terms: 'Termos de Uso',
      support: 'Suporte',
      joinDiscord: 'Entrar no Discord',
      interface: 'Interface limpa e intuitiva',
      multiLang: 'Disponível em Inglês, Português e Espanhol'
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
      ctaLink: 'Instalar desde Chrome Web Store',
      footer: '© 2025 FlowForge Pro. Todos los derechos reservados.',
      privacy: 'Política de Privacidad',
      terms: 'Términos de Servicio',
      support: 'Soporte',
      joinDiscord: 'Unirse a Discord',
      interface: 'Interfaz limpia e intuitiva',
      multiLang: 'Disponible en Inglés, Portugués y Español'
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
    <meta property="og:title" content="${i.title} - ${i.tagline}">
    <meta property="og:description" content="${i.description}">
    <meta property="og:type" content="website">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-primary: #0a0a0f;
            --bg-secondary: #12121a;
            --bg-card: #1a1a25;
            --bg-card-hover: #222230;
            --accent: #8b5cf6;
            --accent-glow: rgba(139, 92, 246, 0.4);
            --accent-light: #a78bfa;
            --accent-secondary: #06b6d4;
            --text-primary: #f8fafc;
            --text-secondary: #94a3b8;
            --text-muted: #64748b;
            --border: rgba(255,255,255,0.08);
            --border-accent: rgba(139, 92, 246, 0.3);
            --gradient-1: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%);
            --gradient-2: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
            --gradient-card: linear-gradient(145deg, rgba(139, 92, 246, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html {
            scroll-behavior: smooth;
        }

        body {
            font-family: 'Outfit', sans-serif;
            background: var(--bg-primary);
            color: var(--text-primary);
            line-height: 1.6;
            overflow-x: hidden;
        }

        /* Animated Background */
        .bg-animation {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            overflow: hidden;
        }

        .bg-animation::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: 
                radial-gradient(ellipse at 20% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 80%, rgba(6, 182, 212, 0.1) 0%, transparent 50%),
                radial-gradient(ellipse at 50% 50%, rgba(236, 72, 153, 0.05) 0%, transparent 60%);
            animation: bgPulse 20s ease-in-out infinite;
        }

        @keyframes bgPulse {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }
            50% { transform: translate(-3%, -3%) scale(1.05); opacity: 0.8; }
        }

        /* Grid Pattern */
        .grid-pattern {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            background-image: 
                linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
            background-size: 80px 80px;
        }

        /* Header */
        header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 100;
            padding: 16px 40px;
            backdrop-filter: blur(20px);
            background: rgba(10, 10, 15, 0.85);
            border-bottom: 1px solid var(--border);
        }

        nav {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 12px;
            text-decoration: none;
        }

        .logo-icon {
            width: 44px;
            height: 44px;
            background: var(--gradient-1);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 16px;
            color: white;
            box-shadow: 0 4px 20px var(--accent-glow);
        }

        .logo-text {
            font-size: 22px;
            font-weight: 700;
            color: var(--text-primary);
            letter-spacing: -0.5px;
        }

        .nav-links {
            display: flex;
            gap: 32px;
            list-style: none;
            align-items: center;
        }

        .nav-links a {
            color: var(--text-secondary);
            text-decoration: none;
            font-weight: 500;
            font-size: 15px;
            transition: color 0.3s;
        }

        .nav-links a:hover {
            color: var(--text-primary);
        }

        .nav-discord {
            display: flex;
            align-items: center;
            gap: 8px;
            background: #5865F2;
            padding: 10px 18px;
            border-radius: 10px;
            color: white !important;
            font-weight: 600;
            transition: all 0.3s;
        }

        .nav-discord:hover {
            background: #4752C4;
            transform: translateY(-2px);
        }

        .nav-discord svg {
            width: 20px;
            height: 20px;
        }

        /* Hero */
        .hero {
            min-height: 100vh;
            display: flex;
            align-items: center;
            padding: 120px 40px 80px;
        }

        .hero-container {
            max-width: 1200px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 60px;
            align-items: center;
        }

        .hero-content {
            max-width: 560px;
        }

        .badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(139, 92, 246, 0.15);
            border: 1px solid var(--border-accent);
            padding: 8px 16px;
            border-radius: 100px;
            font-size: 13px;
            font-weight: 500;
            color: var(--accent-light);
            margin-bottom: 24px;
            animation: fadeInUp 0.6s ease-out;
        }

        .badge::before {
            content: '';
            width: 8px;
            height: 8px;
            background: var(--accent);
            border-radius: 50%;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.3); }
        }

        h1 {
            font-size: 52px;
            font-weight: 800;
            line-height: 1.1;
            letter-spacing: -2px;
            margin-bottom: 20px;
            animation: fadeInUp 0.6s ease-out 0.1s both;
        }

        h1 span {
            background: var(--gradient-1);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .hero-description {
            font-size: 18px;
            color: var(--text-secondary);
            margin-bottom: 32px;
            line-height: 1.7;
            animation: fadeInUp 0.6s ease-out 0.2s both;
        }

        .hero-cta {
            display: flex;
            gap: 16px;
            flex-wrap: wrap;
            animation: fadeInUp 0.6s ease-out 0.3s both;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 16px 28px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s ease;
            cursor: pointer;
            border: none;
        }

        .btn-primary {
            background: var(--gradient-1);
            color: white;
            box-shadow: 0 4px 20px var(--accent-glow);
        }

        .btn-primary:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 30px var(--accent-glow);
        }

        .btn-secondary {
            background: var(--bg-card);
            color: var(--text-primary);
            border: 1px solid var(--border);
        }

        .btn-secondary:hover {
            background: var(--bg-card-hover);
            border-color: var(--accent);
        }

        /* Hero Visual */
        .hero-visual {
            position: relative;
            animation: fadeInUp 0.8s ease-out 0.4s both;
        }

        .hero-image-container {
            position: relative;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
            border: 1px solid var(--border);
        }

        .hero-image {
            width: 100%;
            height: auto;
            display: block;
        }

        .hero-glow {
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle at center, var(--accent-glow) 0%, transparent 60%);
            z-index: -1;
            animation: glowPulse 4s ease-in-out infinite;
        }

        @keyframes glowPulse {
            0%, 100% { opacity: 0.5; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.1); }
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Video Section */
        .video-section {
            padding: 80px 40px;
            max-width: 1000px;
            margin: 0 auto;
        }

        .video-container {
            position: relative;
            border-radius: 20px;
            overflow: hidden;
            background: var(--bg-card);
            border: 1px solid var(--border);
            aspect-ratio: 16/9;
        }

        .video-container video {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .video-placeholder {
            position: absolute;
            inset: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: var(--gradient-card);
            cursor: pointer;
            transition: all 0.3s;
        }

        .video-placeholder:hover {
            background: rgba(139, 92, 246, 0.15);
        }

        .play-button {
            width: 80px;
            height: 80px;
            background: var(--gradient-1);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 16px;
            box-shadow: 0 8px 30px var(--accent-glow);
            transition: transform 0.3s;
        }

        .video-placeholder:hover .play-button {
            transform: scale(1.1);
        }

        .play-button svg {
            width: 32px;
            height: 32px;
            fill: white;
            margin-left: 4px;
        }

        .video-title {
            font-size: 18px;
            font-weight: 600;
            color: var(--text-primary);
        }

        /* Screenshots Gallery */
        .screenshots {
            padding: 60px 40px;
            max-width: 1200px;
            margin: 0 auto;
        }

        .screenshots-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
        }

        .screenshot-card {
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid var(--border);
            transition: all 0.4s;
            background: var(--bg-card);
        }

        .screenshot-card:hover {
            transform: translateY(-8px);
            border-color: var(--border-accent);
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }

        .screenshot-card img {
            width: 100%;
            height: auto;
            display: block;
        }

        .screenshot-label {
            padding: 16px;
            text-align: center;
            font-size: 14px;
            color: var(--text-secondary);
            border-top: 1px solid var(--border);
        }

        /* Features */
        .features {
            padding: 100px 40px;
            max-width: 1200px;
            margin: 0 auto;
        }

        .section-header {
            text-align: center;
            margin-bottom: 60px;
        }

        .section-header h2 {
            font-size: 42px;
            font-weight: 700;
            letter-spacing: -1px;
            margin-bottom: 16px;
        }

        .section-header p {
            color: var(--text-secondary);
            font-size: 18px;
            max-width: 600px;
            margin: 0 auto;
        }

        .features-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
        }

        .feature-card {
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: 20px;
            padding: 32px;
            transition: all 0.4s ease;
            position: relative;
            overflow: hidden;
        }

        .feature-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: var(--gradient-1);
            opacity: 0;
            transition: opacity 0.3s;
        }

        .feature-card:hover {
            transform: translateY(-8px);
            border-color: var(--border-accent);
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }

        .feature-card:hover::before {
            opacity: 1;
        }

        .feature-icon {
            width: 56px;
            height: 56px;
            background: var(--gradient-card);
            border: 1px solid var(--border-accent);
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
        }

        .feature-icon svg {
            width: 28px;
            height: 28px;
            stroke: var(--accent-light);
        }

        .feature-card h3 {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 12px;
        }

        .feature-card p {
            color: var(--text-secondary);
            font-size: 15px;
            line-height: 1.6;
        }

        /* How It Works */
        .how-it-works {
            padding: 100px 40px;
            background: var(--bg-secondary);
        }

        .how-it-works-container {
            max-width: 1200px;
            margin: 0 auto;
        }

        .steps-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 32px;
        }

        .step-card {
            text-align: center;
            position: relative;
        }

        .step-number {
            width: 60px;
            height: 60px;
            background: var(--gradient-1);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: 700;
            margin: 0 auto 20px;
            box-shadow: 0 8px 20px var(--accent-glow);
        }

        .step-card h3 {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 8px;
        }

        .step-card p {
            color: var(--text-secondary);
            font-size: 14px;
        }

        .step-connector {
            position: absolute;
            top: 30px;
            right: -16px;
            width: 32px;
            height: 2px;
            background: var(--border-accent);
        }

        .step-card:last-child .step-connector {
            display: none;
        }

        /* Pricing */
        .pricing {
            padding: 100px 40px;
        }

        .pricing-container {
            max-width: 500px;
            margin: 0 auto;
        }

        .pricing-card {
            background: var(--bg-card);
            border: 2px solid var(--accent);
            border-radius: 24px;
            padding: 48px 40px;
            position: relative;
            overflow: hidden;
            text-align: center;
        }

        .pricing-card::before {
            content: '';
            position: absolute;
            top: -100px;
            right: -100px;
            width: 200px;
            height: 200px;
            background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%);
        }

        .pricing-badge {
            position: absolute;
            top: 24px;
            right: 24px;
            background: var(--gradient-1);
            padding: 8px 16px;
            border-radius: 100px;
            font-size: 13px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .pricing-name {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
        }

        .pricing-price {
            font-size: 64px;
            font-weight: 800;
            margin: 24px 0 8px;
            letter-spacing: -2px;
        }

        .pricing-price span {
            font-size: 22px;
            font-weight: 400;
            color: var(--text-secondary);
        }

        .pricing-period {
            color: var(--text-muted);
            margin-bottom: 32px;
        }

        .pricing-features {
            list-style: none;
            text-align: left;
            margin-bottom: 32px;
        }

        .pricing-features li {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px 0;
            border-bottom: 1px solid var(--border);
            color: var(--text-secondary);
            font-size: 15px;
        }

        .pricing-features li:last-child {
            border-bottom: none;
        }

        .pricing-features svg {
            width: 22px;
            height: 22px;
            stroke: #10b981;
            flex-shrink: 0;
        }

        /* Footer */
        footer {
            padding: 60px 40px;
            border-top: 1px solid var(--border);
            background: var(--bg-secondary);
        }

        .footer-content {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 24px;
        }

        .footer-brand {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .footer-links {
            display: flex;
            gap: 32px;
        }

        .footer-links a {
            color: var(--text-secondary);
            text-decoration: none;
            font-size: 14px;
            transition: color 0.3s;
        }

        .footer-links a:hover {
            color: var(--text-primary);
        }

        .footer-copy {
            color: var(--text-muted);
            font-size: 14px;
            width: 100%;
            text-align: center;
            margin-top: 24px;
            padding-top: 24px;
            border-top: 1px solid var(--border);
        }

        /* Responsive */
        @media (max-width: 1024px) {
            .hero-container {
                grid-template-columns: 1fr;
                text-align: center;
            }

            .hero-content {
                max-width: 100%;
            }

            .hero-cta {
                justify-content: center;
            }

            .features-grid {
                grid-template-columns: 1fr;
            }

            .steps-grid {
                grid-template-columns: repeat(2, 1fr);
            }

            .step-connector {
                display: none;
            }

            .screenshots-grid {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 768px) {
            header {
                padding: 16px 20px;
            }

            .nav-links {
                display: none;
            }

            .hero {
                padding: 100px 20px 60px;
            }

            h1 {
                font-size: 36px;
                letter-spacing: -1px;
            }

            .hero-description {
                font-size: 16px;
            }

            .features, .pricing, .how-it-works {
                padding: 60px 20px;
            }

            .section-header h2 {
                font-size: 32px;
            }

            .steps-grid {
                grid-template-columns: 1fr;
            }

            .footer-content {
                flex-direction: column;
                text-align: center;
            }

            .footer-links {
                flex-wrap: wrap;
                justify-content: center;
            }
        }

        /* Mobile menu button */
        .mobile-menu-btn {
            display: none;
            background: none;
            border: none;
            cursor: pointer;
            padding: 8px;
        }

        .mobile-menu-btn svg {
            width: 28px;
            height: 28px;
            stroke: var(--text-primary);
        }

        @media (max-width: 768px) {
            .mobile-menu-btn {
                display: block;
            }
        }
    </style>
</head>
<body>
    <div class="bg-animation"></div>
    <div class="grid-pattern"></div>

    <header>
        <nav>
            <a href="/" class="logo">
                <div class="logo-icon">FF</div>
                <span class="logo-text">${i.title}</span>
            </a>
            <ul class="nav-links">
                <li><a href="#features">${i.features}</a></li>
                <li><a href="#how-it-works">${i.howItWorks}</a></li>
                <li><a href="#pricing">${i.pricing}</a></li>
                <li>
                    <a href="${discordUrl}" target="_blank" class="nav-discord">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                        </svg>
                        ${i.joinDiscord}
                    </a>
                </li>
            </ul>
            <button class="mobile-menu-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            </button>
        </nav>
    </header>

    <main>
        <section class="hero">
            <div class="hero-container">
                <div class="hero-content">
                    <div class="badge">Chrome Extension • VEO AI Automator</div>
                    <h1>${i.tagline.split(' ').slice(0, -2).join(' ')} <span>${i.tagline.split(' ').slice(-2).join(' ')}</span></h1>
                    <p class="hero-description">${i.description}</p>
                    <div class="hero-cta">
                        <a href="#pricing" class="btn btn-primary">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                            </svg>
                            ${i.cta}
                        </a>
                        <a href="#demo" class="btn btn-secondary">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                            ${i.watchDemo}
                        </a>
                    </div>
                </div>
                <div class="hero-visual">
                    <div class="hero-glow"></div>
                    <div class="hero-image-container">
                        <!-- SUBSTITUA PELA URL DA IMAGEM: FlowForge_Pro.png -->
                        <img src="IMAGE_URL_MAIN" alt="FlowForge Pro Interface" class="hero-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22600%22 height=%22400%22%3E%3Crect fill=%22%231a1a25%22 width=%22600%22 height=%22400%22/%3E%3Ctext fill=%22%238b5cf6%22 font-family=%22sans-serif%22 font-size=%2224%22 text-anchor=%22middle%22 x=%22300%22 y=%22200%22%3EFlowForge Pro%3C/text%3E%3C/svg%3E'">
                    </div>
                </div>
            </div>
        </section>

        <!-- Video Demo Section -->
        <section class="video-section" id="demo">
            <div class="video-container">
                <!-- Placeholder para o vídeo - Substitua VIDEO_URL_HERE pelo link real -->
                <video id="demo-video" controls style="display: none;">
                    <source src="VIDEO_URL_HERE" type="video/mp4">
                </video>
                <div class="video-placeholder" onclick="playVideo()">
                    <div class="play-button">
                        <svg viewBox="0 0 24 24">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                    </div>
                    <span class="video-title">${i.watchDemo}</span>
                </div>
            </div>
        </section>

        <!-- Screenshots -->
        <section class="screenshots">
            <div class="screenshots-grid">
                <div class="screenshot-card">
                    <!-- SUBSTITUA: Design_sem_nome-33.png (login) -->
                    <img src="IMAGE_URL_LOGIN" alt="Login Screen" onerror="this.parentElement.style.display='none'">
                    <div class="screenshot-label">Login / Register</div>
                </div>
                <div class="screenshot-card">
                    <!-- SUBSTITUA: Design_sem_nome-31.png (interface ativa) -->
                    <img src="IMAGE_URL_ACTIVE" alt="Active Interface" onerror="this.parentElement.style.display='none'">
                    <div class="screenshot-label">\${i.interface}</div>
                </div>
                <div class="screenshot-card">
                    <!-- SUBSTITUA: Design_sem_nome-32.png (inglês) -->
                    <img src="IMAGE_URL_WORKING" alt="Working Mode" onerror="this.parentElement.style.display='none'">
                    <div class="screenshot-label">\${i.multiLang}</div>
                </div>
            </div>
        </section>

        <section class="features" id="features">
            <div class="section-header">
                <h2>${i.features}</h2>
            </div>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                        </svg>
                    </div>
                    <h3>${i.feature1}</h3>
                    <p>${i.feature1Desc}</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
                        </svg>
                    </div>
                    <h3>${i.feature2}</h3>
                    <p>${i.feature2Desc}</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                    </div>
                    <h3>${i.feature3}</h3>
                    <p>${i.feature3Desc}</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                            <line x1="8" y1="21" x2="16" y2="21"></line>
                            <line x1="12" y1="17" x2="12" y2="21"></line>
                        </svg>
                    </div>
                    <h3>${i.feature4}</h3>
                    <p>${i.feature4Desc}</p>
                </div>
            </div>
        </section>

        <section class="how-it-works" id="how-it-works">
            <div class="how-it-works-container">
                <div class="section-header">
                    <h2>${i.howItWorks}</h2>
                </div>
                <div class="steps-grid">
                    <div class="step-card">
                        <div class="step-number">1</div>
                        <h3>${i.step1}</h3>
                        <p>${i.step1Desc}</p>
                        <div class="step-connector"></div>
                    </div>
                    <div class="step-card">
                        <div class="step-number">2</div>
                        <h3>${i.step2}</h3>
                        <p>${i.step2Desc}</p>
                        <div class="step-connector"></div>
                    </div>
                    <div class="step-card">
                        <div class="step-number">3</div>
                        <h3>${i.step3}</h3>
                        <p>${i.step3Desc}</p>
                        <div class="step-connector"></div>
                    </div>
                    <div class="step-card">
                        <div class="step-number">4</div>
                        <h3>${i.step4}</h3>
                        <p>${i.step4Desc}</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="pricing" id="pricing">
            <div class="section-header">
                <h2>${i.pricing}</h2>
            </div>
            <div class="pricing-container">
                <div class="pricing-card">
                    <div class="pricing-badge">${i.trial}</div>
                    <h3 class="pricing-name">FlowForge Pro</h3>
                    <div class="pricing-price">$9.90 <span>${i.monthly}</span></div>
                    <p class="pricing-period">${i.afterTrial}</p>
                    <ul class="pricing-features">
                        <li>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            ${i.unlimited}
                        </li>
                        <li>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            ${i.feature1} (500+)
                        </li>
                        <li>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            ${i.feature3}
                        </li>
                        <li>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            ${i.priority}
                        </li>
                        <li>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            ${i.updates}
                        </li>
                    </ul>
                    <a href="#" class="btn btn-primary" style="width: 100%; justify-content: center;">
                        ${i.cta}
                    </a>
                </div>
            </div>
        </section>
    </main>

    <footer>
        <div class="footer-content">
            <div class="footer-brand">
                <div class="logo-icon" style="width: 36px; height: 36px; font-size: 14px;">FF</div>
                <span class="logo-text" style="font-size: 18px;">${i.title}</span>
            </div>
            <div class="footer-links">
                <a href="/api/privacy">${i.privacy}</a>
                <a href="/api/terms">${i.terms}</a>
                <a href="${discordUrl}" target="_blank">${i.support} (Discord)</a>
            </div>
            <p class="footer-copy">${i.footer}</p>
        </div>
    </footer>

    <script>
        function playVideo() {
            const video = document.getElementById('demo-video');
            const placeholder = document.querySelector('.video-placeholder');
            
            // Verifica se o vídeo tem uma fonte válida
            if (video.querySelector('source').src && !video.querySelector('source').src.includes('VIDEO_URL_HERE')) {
                placeholder.style.display = 'none';
                video.style.display = 'block';
                video.play();
            } else {
                // Se não tem vídeo, redireciona para o Discord
                window.open('${discordUrl}', '_blank');
            }
        }
    </script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  return res.status(200).send(html);
}
