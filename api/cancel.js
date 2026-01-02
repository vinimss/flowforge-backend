// api/cancel.js
export default async function handler(req, res) {
  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pagamento Cancelado - FlowForge Pro</title>
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
        
        <h1>Pagamento Cancelado</h1>
        
        <p>Você cancelou o processo de pagamento.</p>
        <p>Não se preocupe, nenhuma cobrança foi realizada.</p>
        
        <div class="info-box">
            <h3>💡 Mudou de ideia?</h3>
            <p>Você pode iniciar o teste grátis a qualquer momento clicando na extensão <span class="highlight">FlowForge Pro</span>.</p>
        </div>
        
        <div class="benefits">
            <h3>O que você está perdendo:</h3>
            <ul>
                <li>Automação ilimitada de prompts</li>
                <li>Download de vídeos em lote</li>
                <li>Processamento em segundo plano</li>
                <li>Suporte prioritário</li>
                <li><span class="highlight">1 dia grátis</span> para testar tudo!</li>
            </ul>
        </div>
        
        <div class="close-message">
            Pode fechar esta aba
        </div>
        
        <p class="footer">
            Use <span class="shortcut">⌘W</span> (Mac) ou <span class="shortcut">Ctrl+W</span> (Windows) para fechar.
        </p>
    </div>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  return res.status(200).send(html);
}
