// api/success.js
export default async function handler(req, res) {
  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pagamento Confirmado - FlowForge Pro</title>
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
            margin-top: 30px;
            font-size: 14px;
            color: #666;
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
        
        <h1>🎉 Pagamento Confirmado!</h1>
        
        <p>Sua assinatura do <span class="highlight">FlowForge Pro</span> foi ativada com sucesso.</p>
        
        <div class="trial-info">
            <h3>✨ Teste Grátis Ativado</h3>
            <p>Você tem <span class="highlight">1 dia grátis</span> para experimentar todas as funcionalidades. Após o período de teste, será cobrado 9,90 USD/mês.</p>
        </div>
        
        <div class="instructions">
            <h3>📋 Próximos passos:</h3>
            <ol>
                <li>Feche esta aba</li>
                <li>Clique no ícone da extensão <span class="highlight">FlowForge Pro</span> no Chrome</li>
                <li>Se necessário, faça logout e login novamente</li>
                <li>Aproveite a automação ilimitada!</li>
            </ol>
        </div>
        
        <button class="btn" onclick="window.close();">
            Fechar e Usar a Extensão
        </button>
        
        <p class="footer">
            Você pode fechar esta aba com segurança.
        </p>
    </div>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  return res.status(200).send(html);
}
