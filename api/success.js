// api/success.js
export default async function handler(req, res) {
  // Detectar idioma pelo header Accept-Language
  const acceptLanguage = req.headers['accept-language'] || 'en';
  let lang = 'en';
  
  if (acceptLanguage.includes('pt')) {
    lang = 'pt';
  } else if (acceptLanguage.includes('es')) {
    lang = 'es';
  }

  const translations = {
    en: {
      title: "Payment Confirmed - FlowForge Pro",
      heading: "🎉 Payment Confirmed!",
      subtitle: "Your <span class=\"highlight\">FlowForge Pro</span> subscription has been activated successfully.",
      trialTitle: "✨ Free Trial Activated",
      trialDesc: "You have <span class=\"highlight\">1 free day</span> to try all features.",
      trialPrice: "After the trial period, you will be charged <span class=\"highlight\">9.90 USD/month</span>.",
      warningText: "⚠️ <strong>Important:</strong> The free trial is unique per device. If you change your card or create a new account, you will not be entitled to another free trial.",
      stepsTitle: "📋 Next steps:",
      step1: "Close this tab",
      step2: "Click on the <span class=\"highlight\">FlowForge Pro</span> extension icon in Chrome",
      step3: "If necessary, logout and login again",
      step4: "Enjoy unlimited automation!",
      closeBtn: "Close this tab",
      closeHint: "The browser blocked automatic closing.<br>Use <span class=\"shortcut\">⌘W</span> (Mac) or <span class=\"shortcut\">Ctrl+W</span> (Windows) to close.",
      footerTip: "Tip: <span class=\"shortcut\">⌘W</span> (Mac) or <span class=\"shortcut\">Ctrl+W</span> (Windows)"
    },
    pt: {
      title: "Pagamento Confirmado - FlowForge Pro",
      heading: "🎉 Pagamento Confirmado!",
      subtitle: "Sua assinatura do <span class=\"highlight\">FlowForge Pro</span> foi ativada com sucesso.",
      trialTitle: "✨ Teste Grátis Ativado",
      trialDesc: "Você tem <span class=\"highlight\">1 dia grátis</span> para experimentar todas as funcionalidades.",
      trialPrice: "Após o período de teste, será cobrado <span class=\"highlight\">9,90 USD/mês</span>.",
      warningText: "⚠️ <strong>Importante:</strong> O teste grátis é único por dispositivo. Se você trocar de cartão ou criar nova conta, não terá direito a outro teste grátis.",
      stepsTitle: "📋 Próximos passos:",
      step1: "Feche esta aba",
      step2: "Clique no ícone da extensão <span class=\"highlight\">FlowForge Pro</span> no Chrome",
      step3: "Se necessário, faça logout e login novamente",
      step4: "Aproveite a automação ilimitada!",
      closeBtn: "Fechar esta aba",
      closeHint: "O navegador bloqueou o fechamento automático.<br>Use <span class=\"shortcut\">⌘W</span> (Mac) ou <span class=\"shortcut\">Ctrl+W</span> (Windows) para fechar.",
      footerTip: "Dica: <span class=\"shortcut\">⌘W</span> (Mac) ou <span class=\"shortcut\">Ctrl+W</span> (Windows)"
    },
    es: {
      title: "Pago Confirmado - FlowForge Pro",
      heading: "🎉 ¡Pago Confirmado!",
      subtitle: "Tu suscripción de <span class=\"highlight\">FlowForge Pro</span> ha sido activada con éxito.",
      trialTitle: "✨ Prueba Gratis Activada",
      trialDesc: "Tienes <span class=\"highlight\">1 día gratis</span> para probar todas las funcionalidades.",
      trialPrice: "Después del período de prueba, se cobrará <span class=\"highlight\">9,90 USD/mes</span>.",
      warningText: "⚠️ <strong>Importante:</strong> La prueba gratis es única por dispositivo. Si cambias de tarjeta o creas una nueva cuenta, no tendrás derecho a otra prueba gratis.",
      stepsTitle: "📋 Próximos pasos:",
      step1: "Cierra esta pestaña",
      step2: "Haz clic en el icono de la extensión <span class=\"highlight\">FlowForge Pro</span> en Chrome",
      step3: "Si es necesario, cierra sesión e inicia sesión nuevamente",
      step4: "¡Disfruta de la automatización ilimitada!",
      closeBtn: "Cerrar esta pestaña",
      closeHint: "El navegador bloqueó el cierre automático.<br>Usa <span class=\"shortcut\">⌘W</span> (Mac) o <span class=\"shortcut\">Ctrl+W</span> (Windows) para cerrar.",
      footerTip: "Consejo: <span class=\"shortcut\">⌘W</span> (Mac) o <span class=\"shortcut\">Ctrl+W</span> (Windows)"
    }
  };

  const t = translations[lang];

  const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${t.title}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
        }
        
        .container {
            text-align: center;
            padding: 40px;
            max-width: 500px;
        }
        
        .success-icon {
            width: 100px;
            height: 100px;
            background: linear-gradient(135deg, #00d9a5 0%, #00b894 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 30px;
            animation: pulse 2s infinite;
        }
        
        .success-icon svg {
            width: 50px;
            height: 50px;
            fill: white;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 217, 165, 0.4); }
            50% { transform: scale(1.05); box-shadow: 0 0 0 20px rgba(0, 217, 165, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 217, 165, 0); }
        }
        
        h1 {
            font-size: 28px;
            margin-bottom: 15px;
            color: #00d9a5;
        }
        
        p {
            font-size: 16px;
            color: #a0a0a0;
            margin-bottom: 10px;
            line-height: 1.6;
        }
        
        .highlight {
            color: #fff;
            font-weight: 600;
        }
        
        .trial-info {
            background: rgba(0, 217, 165, 0.1);
            border: 1px solid rgba(0, 217, 165, 0.3);
            border-radius: 12px;
            padding: 20px;
            margin: 25px 0;
        }
        
        .trial-info h3 {
            color: #00d9a5;
            margin-bottom: 10px;
            font-size: 18px;
        }
        
        .warning-box {
            background: rgba(255, 193, 7, 0.1);
            border: 1px solid rgba(255, 193, 7, 0.3);
            border-radius: 12px;
            padding: 15px;
            margin: 20px 0;
        }
        
        .warning-box p {
            color: #ffc107;
            font-size: 14px;
            margin: 0;
        }
        
        .instructions {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            padding: 20px;
            margin: 25px 0;
            text-align: left;
        }
        
        .instructions h3 {
            margin-bottom: 15px;
            font-size: 16px;
        }
        
        .instructions ol {
            padding-left: 20px;
        }
        
        .instructions li {
            margin-bottom: 10px;
            color: #a0a0a0;
        }
        
        .btn {
            display: inline-block;
            background: linear-gradient(135deg, #00d9a5 0%, #00b894 100%);
            color: white;
            padding: 15px 40px;
            border-radius: 30px;
            text-decoration: none;
            font-weight: 600;
            font-size: 16px;
            margin-top: 20px;
            transition: transform 0.2s, box-shadow 0.2s;
            cursor: pointer;
            border: none;
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(0, 217, 165, 0.3);
        }
        
        .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #666;
        }
        
        .shortcut {
            background: rgba(255,255,255,0.1);
            padding: 3px 8px;
            border-radius: 4px;
            font-family: monospace;
            font-size: 14px;
        }
        
        .close-hint {
            display: none;
            margin-top: 15px;
            padding: 15px;
            background: rgba(255, 107, 107, 0.1);
            border-radius: 8px;
            color: #ff6b6b;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="success-icon">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
        </div>
        
        <h1>${t.heading}</h1>
        
        <p>${t.subtitle}</p>
        
        <div class="trial-info">
            <h3>${t.trialTitle}</h3>
            <p>${t.trialDesc}</p>
            <p style="margin-top: 10px;">${t.trialPrice}</p>
        </div>
        
        <div class="warning-box">
            <p>${t.warningText}</p>
        </div>
        
        <div class="instructions">
            <h3>${t.stepsTitle}</h3>
            <ol>
                <li>${t.step1}</li>
                <li>${t.step2}</li>
                <li>${t.step3}</li>
                <li>${t.step4}</li>
            </ol>
        </div>
        
        <button class="btn" onclick="tryClose()">
            ${t.closeBtn}
        </button>
        
        <div id="closeHint" class="close-hint">
            ${t.closeHint}
        </div>
        
        <p class="footer">
            ${t.footerTip}
        </p>
    </div>
    
    <script>
        function tryClose() {
            window.close();
            setTimeout(function() {
                document.getElementById('closeHint').style.display = 'block';
            }, 500);
        }
    </script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  return res.status(200).send(html);
}
