// api/cancel.js
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
      title: "Payment Canceled - FlowForge Pro",
      heading: "Payment Canceled",
      subtitle: "You canceled the payment process.",
      noCharge: "Don't worry, no charge was made.",
      changeTitle: "💡 Changed your mind?",
      changeDesc: "You can start your free trial anytime by clicking on the <span class=\"highlight\">FlowForge Pro</span> extension.",
      missingTitle: "What you're missing:",
      benefit1: "Unlimited prompt automation",
      benefit2: "Batch video downloads",
      benefit3: "Background processing",
      benefit4: "Priority support",
      benefit5: "<span class=\"highlight\">1 free day</span> to test everything!",
      closeMsg: "You can close this tab",
      footerTip: "Use <span class=\"shortcut\">⌘W</span> (Mac) or <span class=\"shortcut\">Ctrl+W</span> (Windows) to close."
    },
    pt: {
      title: "Pagamento Cancelado - FlowForge Pro",
      heading: "Pagamento Cancelado",
      subtitle: "Você cancelou o processo de pagamento.",
      noCharge: "Não se preocupe, nenhuma cobrança foi realizada.",
      changeTitle: "💡 Mudou de ideia?",
      changeDesc: "Você pode iniciar o teste grátis a qualquer momento clicando na extensão <span class=\"highlight\">FlowForge Pro</span>.",
      missingTitle: "O que você está perdendo:",
      benefit1: "Automação ilimitada de prompts",
      benefit2: "Download de vídeos em lote",
      benefit3: "Processamento em segundo plano",
      benefit4: "Suporte prioritário",
      benefit5: "<span class=\"highlight\">1 dia grátis</span> para testar tudo!",
      closeMsg: "Pode fechar esta aba",
      footerTip: "Use <span class=\"shortcut\">⌘W</span> (Mac) ou <span class=\"shortcut\">Ctrl+W</span> (Windows) para fechar."
    },
    es: {
      title: "Pago Cancelado - FlowForge Pro",
      heading: "Pago Cancelado",
      subtitle: "Has cancelado el proceso de pago.",
      noCharge: "No te preocupes, no se realizó ningún cargo.",
      changeTitle: "💡 ¿Cambiaste de opinión?",
      changeDesc: "Puedes iniciar tu prueba gratis en cualquier momento haciendo clic en la extensión <span class=\"highlight\">FlowForge Pro</span>.",
      missingTitle: "Lo que te estás perdiendo:",
      benefit1: "Automatización ilimitada de prompts",
      benefit2: "Descarga de videos en lote",
      benefit3: "Procesamiento en segundo plano",
      benefit4: "Soporte prioritario",
      benefit5: "<span class=\"highlight\">1 día gratis</span> para probar todo!",
      closeMsg: "Puedes cerrar esta pestaña",
      footerTip: "Usa <span class=\"shortcut\">⌘W</span> (Mac) o <span class=\"shortcut\">Ctrl+W</span> (Windows) para cerrar."
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
        
        .cancel-icon {
            width: 100px;
            height: 100px;
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 30px;
        }
        
        .cancel-icon svg {
            width: 50px;
            height: 50px;
            fill: white;
        }
        
        h1 {
            font-size: 28px;
            margin-bottom: 15px;
            color: #ff6b6b;
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
        
        .info-box {
            background: rgba(255, 107, 107, 0.1);
            border: 1px solid rgba(255, 107, 107, 0.3);
            border-radius: 12px;
            padding: 20px;
            margin: 25px 0;
        }
        
        .info-box h3 {
            color: #ff6b6b;
            margin-bottom: 10px;
            font-size: 18px;
        }
        
        .benefits {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            padding: 20px;
            margin: 25px 0;
            text-align: left;
        }
        
        .benefits h3 {
            margin-bottom: 15px;
            font-size: 16px;
            color: #00d9a5;
        }
        
        .benefits ul {
            padding-left: 20px;
            list-style: none;
        }
        
        .benefits li {
            margin-bottom: 10px;
            color: #a0a0a0;
        }
        
        .benefits li::before {
            content: "✓ ";
            color: #00d9a5;
        }
        
        .close-message {
            background: rgba(255, 255, 255, 0.1);
            color: white;
            padding: 15px 40px;
            border-radius: 30px;
            font-weight: 600;
            font-size: 16px;
            margin-top: 20px;
            display: inline-block;
        }
        
        .footer {
            margin-top: 30px;
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
    </style>
</head>
<body>
    <div class="container">
        <div class="cancel-icon">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
            </svg>
        </div>
        
        <h1>${t.heading}</h1>
        
        <p>${t.subtitle}</p>
        <p>${t.noCharge}</p>
        
        <div class="info-box">
            <h3>${t.changeTitle}</h3>
            <p>${t.changeDesc}</p>
        </div>
        
        <div class="benefits">
            <h3>${t.missingTitle}</h3>
            <ul>
                <li>${t.benefit1}</li>
                <li>${t.benefit2}</li>
                <li>${t.benefit3}</li>
                <li>${t.benefit4}</li>
                <li>${t.benefit5}</li>
            </ul>
        </div>
        
        <div class="close-message">
            ${t.closeMsg}
        </div>
        
        <p class="footer">
            ${t.footerTip}
        </p>
    </div>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  return res.status(200).send(html);
}
