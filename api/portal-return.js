// api/portal-return.js
export default async function handler(req, res) {
  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FlowForge Pro - Portal</title>
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
        
        .icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #00d9a5 0%, #00b894 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 30px;
        }
        
        .icon svg {
            width: 40px;
            height: 40px;
            fill: white;
        }
        
        h1 {
            font-size: 24px;
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
        
        .info-box {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            padding: 20px;
            margin: 25px 0;
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
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
        </div>
        
        <h1>✅ Alterações Salvas</h1>
        
        <p>Suas alterações na assinatura foram processadas.</p>
        
        <div class="info-box">
            <p>Você pode fechar esta aba e voltar para a extensão <span class="highlight">FlowForge Pro</span>.</p>
            <p style="margin-top: 10px;">Se fez alguma alteração, faça logout e login novamente na extensão para atualizar.</p>
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
