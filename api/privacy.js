// api/privacy.js
export default async function handler(req, res) {
  const acceptLanguage = req.headers['accept-language'] || 'en';
  let lang = 'en';
  
  if (acceptLanguage.includes('pt')) {
    lang = 'pt';
  } else if (acceptLanguage.includes('es')) {
    lang = 'es';
  }

  const translations = {
    en: {
      title: "Privacy Policy - FlowForge Pro",
      heading: "Privacy Policy",
      lastUpdated: "Last updated: January 2026",
      sections: [
        {
          title: "1. Introduction",
          content: `FlowForge Pro ("we", "our", or "the Extension") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our browser extension.`
        },
        {
          title: "2. Information We Collect",
          content: `<strong>Account Information:</strong>
          <ul>
            <li>Email address (for account creation and communication)</li>
            <li>Encrypted password</li>
            <li>Account creation date</li>
          </ul>
          
          <strong>Technical Information:</strong>
          <ul>
            <li>Device fingerprint (for fraud prevention and trial limitation)</li>
            <li>IP address (for security purposes)</li>
            <li>Browser type and version</li>
          </ul>
          
          <strong>Usage Information:</strong>
          <ul>
            <li>Extension usage patterns</li>
            <li>Number of prompts processed</li>
            <li>Subscription status</li>
          </ul>
          
          <strong>Payment Information:</strong>
          <ul>
            <li>Payment processing is handled by Stripe. We do not store your full credit card information.</li>
            <li>We only store a reference to your Stripe customer ID.</li>
          </ul>`
        },
        {
          title: "3. How We Use Your Information",
          content: `We use the collected information for:
          <ul>
            <li>Providing and maintaining the Extension</li>
            <li>Processing your subscription payments</li>
            <li>Sending important account notifications</li>
            <li>Preventing fraud and abuse</li>
            <li>Enforcing the one trial per device policy</li>
            <li>Improving our services</li>
            <li>Responding to support requests</li>
          </ul>`
        },
        {
          title: "4. Data Storage and Security",
          content: `<ul>
            <li>Your data is stored securely on Supabase servers.</li>
            <li>Passwords are hashed and never stored in plain text.</li>
            <li>We use industry-standard encryption for data transmission.</li>
            <li>Access to user data is restricted to authorized personnel only.</li>
          </ul>`
        },
        {
          title: "5. Third-Party Services",
          content: `We use the following third-party services:
          <ul>
            <li><strong>Supabase:</strong> Database and authentication services</li>
            <li><strong>Stripe:</strong> Payment processing</li>
            <li><strong>Vercel:</strong> API hosting</li>
            <li><strong>Resend:</strong> Email delivery</li>
          </ul>
          Each of these services has their own privacy policies. We recommend reviewing them.`
        },
        {
          title: "6. Data Retention",
          content: `<ul>
            <li>Account data is retained while your account is active.</li>
            <li>After account deletion, personal data is removed within 30 days.</li>
            <li>Device fingerprints are retained indefinitely to enforce the trial policy.</li>
            <li>Payment records are retained as required by law.</li>
          </ul>`
        },
        {
          title: "7. Your Rights",
          content: `You have the right to:
          <ul>
            <li><strong>Access:</strong> Request a copy of your personal data</li>
            <li><strong>Correction:</strong> Update inaccurate information</li>
            <li><strong>Deletion:</strong> Request deletion of your account and data</li>
            <li><strong>Portability:</strong> Receive your data in a portable format</li>
            <li><strong>Objection:</strong> Object to certain data processing</li>
          </ul>
          To exercise these rights, contact us via Discord: <a href="https://discord.com/invite/dURj8CgbR" target="_blank" rel="noopener noreferrer">Discord Support</a>`
        },
        {
          title: "8. Cookies and Local Storage",
          content: `The Extension uses:
          <ul>
            <li><strong>Local Storage:</strong> To store your session token and preferences</li>
            <li><strong>No tracking cookies:</strong> We do not use third-party tracking cookies</li>
          </ul>`
        },
        {
          title: "9. Children's Privacy",
          content: `The Extension is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us.`
        },
        {
          title: "10. International Data Transfers",
          content: `Your data may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.`
        },
        {
          title: "11. Changes to This Policy",
          content: `We may update this Privacy Policy from time to time. We will post significant updates in our Discord support channel: <a href="https://discord.com/invite/dURj8CgbR" target="_blank" rel="noopener noreferrer">Discord Support</a>. Continued use of the Extension after changes constitutes acceptance of the updated policy.`
        },
        {
          title: "12. Contact Us",
          content: `For questions about this Privacy Policy or your data, contact us at: <a href="https://discord.com/invite/dURj8CgbR" target="_blank" rel="noopener noreferrer">Discord Support</a>`
        }
      ]
    },
    pt: {
      title: "Política de Privacidade - FlowForge Pro",
      heading: "Política de Privacidade",
      lastUpdated: "Última atualização: Janeiro de 2026",
      sections: [
        {
          title: "1. Introdução",
          content: `O FlowForge Pro ("nós", "nosso" ou "a Extensão") está comprometido em proteger sua privacidade. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações quando você usa nossa extensão de navegador.`
        },
        {
          title: "2. Informações que Coletamos",
          content: `<strong>Informações da Conta:</strong>
          <ul>
            <li>Endereço de email (para criação de conta e comunicação)</li>
            <li>Senha criptografada</li>
            <li>Data de criação da conta</li>
          </ul>
          
          <strong>Informações Técnicas:</strong>
          <ul>
            <li>Impressão digital do dispositivo (para prevenção de fraude e limitação de teste)</li>
            <li>Endereço IP (para fins de segurança)</li>
            <li>Tipo e versão do navegador</li>
          </ul>
          
          <strong>Informações de Uso:</strong>
          <ul>
            <li>Padrões de uso da extensão</li>
            <li>Número de prompts processados</li>
            <li>Status da assinatura</li>
          </ul>
          
          <strong>Informações de Pagamento:</strong>
          <ul>
            <li>O processamento de pagamentos é feito pelo Stripe. Não armazenamos suas informações completas do cartão de crédito.</li>
            <li>Armazenamos apenas uma referência ao seu ID de cliente Stripe.</li>
          </ul>`
        },
        {
          title: "3. Como Usamos Suas Informações",
          content: `Usamos as informações coletadas para:
          <ul>
            <li>Fornecer e manter a Extensão</li>
            <li>Processar seus pagamentos de assinatura</li>
            <li>Enviar notificações importantes da conta</li>
            <li>Prevenir fraude e abuso</li>
            <li>Aplicar a política de um teste por dispositivo</li>
            <li>Melhorar nossos serviços</li>
            <li>Responder a solicitações de suporte</li>
          </ul>`
        },
        {
          title: "4. Armazenamento e Segurança de Dados",
          content: `<ul>
            <li>Seus dados são armazenados com segurança nos servidores do Supabase.</li>
            <li>As senhas são hasheadas e nunca armazenadas em texto simples.</li>
            <li>Usamos criptografia padrão da indústria para transmissão de dados.</li>
            <li>O acesso aos dados dos usuários é restrito apenas ao pessoal autorizado.</li>
          </ul>`
        },
        {
          title: "5. Serviços de Terceiros",
          content: `Utilizamos os seguintes serviços de terceiros:
          <ul>
            <li><strong>Supabase:</strong> Serviços de banco de dados e autenticação</li>
            <li><strong>Stripe:</strong> Processamento de pagamentos</li>
            <li><strong>Vercel:</strong> Hospedagem de API</li>
            <li><strong>Resend:</strong> Entrega de emails</li>
          </ul>
          Cada um desses serviços possui suas próprias políticas de privacidade. Recomendamos revisá-las.`
        },
        {
          title: "6. Retenção de Dados",
          content: `<ul>
            <li>Os dados da conta são retidos enquanto sua conta estiver ativa.</li>
            <li>Após a exclusão da conta, os dados pessoais são removidos em até 30 dias.</li>
            <li>As impressões digitais do dispositivo são retidas indefinidamente para aplicar a política de teste.</li>
            <li>Registros de pagamento são mantidos conforme exigido por lei.</li>
          </ul>`
        },
        {
          title: "7. Seus Direitos",
          content: `Você tem o direito de:
          <ul>
            <li><strong>Acesso:</strong> Solicitar uma cópia dos seus dados pessoais</li>
            <li><strong>Correção:</strong> Atualizar informações imprecisas</li>
            <li><strong>Exclusão:</strong> Solicitar a exclusão da sua conta e dados</li>
            <li><strong>Portabilidade:</strong> Receber seus dados em formato portátil</li>
            <li><strong>Objeção:</strong> Opor-se a determinado processamento de dados</li>
          </ul>
          Para exercer esses direitos, entre em contato via Discord: <a href="https://discord.com/invite/dURj8CgbR" target="_blank" rel="noopener noreferrer">Suporte no Discord</a>`
        },
        {
          title: "8. Cookies e Armazenamento Local",
          content: `A Extensão usa:
          <ul>
            <li><strong>Armazenamento Local:</strong> Para armazenar seu token de sessão e preferências</li>
            <li><strong>Sem cookies de rastreamento:</strong> Não usamos cookies de rastreamento de terceiros</li>
          </ul>`
        },
        {
          title: "9. Privacidade de Crianças",
          content: `A Extensão não é destinada a menores de 13 anos. Não coletamos intencionalmente informações pessoais de menores de 13 anos. Se você acredita que uma criança nos forneceu informações pessoais, entre em contato conosco.`
        },
        {
          title: "10. Transferências Internacionais de Dados",
          content: `Seus dados podem ser transferidos e processados em países diferentes do seu. Garantimos que as salvaguardas apropriadas estejam em vigor para essas transferências.`
        },
        {
          title: "11. Alterações nesta Política",
          content: `Podemos atualizar esta Política de Privacidade periodicamente. Publicaremos atualizações significativas no nosso Discord de suporte: <a href="https://discord.com/invite/dURj8CgbR" target="_blank" rel="noopener noreferrer">Suporte no Discord</a>. O uso continuado da Extensão após as alterações constitui aceitação da política atualizada.`
        },
        {
          title: "12. Contato",
          content: `Para perguntas sobre esta Política de Privacidade ou seus dados, entre em contato pelo: <a href="https://discord.com/invite/dURj8CgbR" target="_blank" rel="noopener noreferrer">Discord Support</a>`
        }
      ]
    },
    es: {
      title: "Política de Privacidad - FlowForge Pro",
      heading: "Política de Privacidad",
      lastUpdated: "Última actualización: Enero de 2026",
      sections: [
        {
          title: "1. Introducción",
          content: `FlowForge Pro ("nosotros", "nuestro" o "la Extensión") está comprometido con la protección de su privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y protegemos su información cuando usa nuestra extensión de navegador.`
        },
        {
          title: "2. Información que Recopilamos",
          content: `<strong>Información de la Cuenta:</strong>
          <ul>
            <li>Dirección de correo electrónico (para creación de cuenta y comunicación)</li>
            <li>Contraseña encriptada</li>
            <li>Fecha de creación de la cuenta</li>
          </ul>
          
          <strong>Información Técnica:</strong>
          <ul>
            <li>Huella digital del dispositivo (para prevención de fraude y limitación de prueba)</li>
            <li>Dirección IP (para fines de seguridad)</li>
            <li>Tipo y versión del navegador</li>
          </ul>
          
          <strong>Información de Uso:</strong>
          <ul>
            <li>Patrones de uso de la extensión</li>
            <li>Número de prompts procesados</li>
            <li>Estado de la suscripción</li>
          </ul>
          
          <strong>Información de Pago:</strong>
          <ul>
            <li>El procesamiento de pagos es manejado por Stripe. No almacenamos la información completa de su tarjeta de crédito.</li>
            <li>Solo almacenamos una referencia a su ID de cliente de Stripe.</li>
          </ul>`
        },
        {
          title: "3. Cómo Usamos Su Información",
          content: `Usamos la información recopilada para:
          <ul>
            <li>Proporcionar y mantener la Extensión</li>
            <li>Procesar sus pagos de suscripción</li>
            <li>Enviar notificaciones importantes de la cuenta</li>
            <li>Prevenir fraude y abuso</li>
            <li>Aplicar la política de una prueba por dispositivo</li>
            <li>Mejorar nuestros servicios</li>
            <li>Responder a solicitudes de soporte</li>
          </ul>`
        },
        {
          title: "4. Almacenamiento y Seguridad de Datos",
          content: `<ul>
            <li>Sus datos se almacenan de forma segura en los servidores de Supabase.</li>
            <li>Las contraseñas se hashean y nunca se almacenan en texto plano.</li>
            <li>Usamos cifrado estándar de la industria para la transmisión de datos.</li>
            <li>El acceso a los datos de los usuarios está restringido solo al personal autorizado.</li>
          </ul>`
        },
        {
          title: "5. Servicios de Terceros",
          content: `Utilizamos los siguientes servicios de terceros:
          <ul>
            <li><strong>Supabase:</strong> Servicios de base de datos y autenticación</li>
            <li><strong>Stripe:</strong> Procesamiento de pagos</li>
            <li><strong>Vercel:</strong> Alojamiento de API</li>
            <li><strong>Resend:</strong> Entrega de correos electrónicos</li>
          </ul>
          Cada uno de estos servicios tiene sus propias políticas de privacidad. Recomendamos revisarlas.`
        },
        {
          title: "6. Retención de Datos",
          content: `<ul>
            <li>Los datos de la cuenta se conservan mientras su cuenta esté activa.</li>
            <li>Después de la eliminación de la cuenta, los datos personales se eliminan en un plazo de 30 días.</li>
            <li>Las huellas digitales del dispositivo se conservan indefinidamente para aplicar la política de prueba.</li>
            <li>Los registros de pago se conservan según lo exigido por la ley.</li>
          </ul>`
        },
        {
          title: "7. Sus Derechos",
          content: `Usted tiene derecho a:
          <ul>
            <li><strong>Acceso:</strong> Solicitar una copia de sus datos personales</li>
            <li><strong>Corrección:</strong> Actualizar información inexacta</li>
            <li><strong>Eliminación:</strong> Solicitar la eliminación de su cuenta y datos</li>
            <li><strong>Portabilidad:</strong> Recibir sus datos en un formato portable</li>
            <li><strong>Objeción:</strong> Oponerse a cierto procesamiento de datos</li>
          </ul>
          Para ejercer estos derechos, contáctenos vía Discord: <a href="https://discord.com/invite/dURj8CgbR" target="_blank" rel="noopener noreferrer">Soporte en Discord</a>`
        },
        {
          title: "8. Cookies y Almacenamiento Local",
          content: `La Extensión usa:
          <ul>
            <li><strong>Almacenamiento Local:</strong> Para almacenar su token de sesión y preferencias</li>
            <li><strong>Sin cookies de seguimiento:</strong> No usamos cookies de seguimiento de terceros</li>
          </ul>`
        },
        {
          title: "9. Privacidad de los Niños",
          content: `La Extensión no está destinada a niños menores de 13 años. No recopilamos intencionalmente información personal de niños menores de 13 años. Si cree que un niño nos ha proporcionado información personal, contáctenos.`
        },
        {
          title: "10. Transferencias Internacionales de Datos",
          content: `Sus datos pueden ser transferidos y procesados en países distintos al suyo. Aseguramos que existan las salvaguardas apropiadas para dichas transferencias.`
        },
        {
          title: "11. Cambios a esta Política",
          content: `Podemos actualizar esta Política de Privacidad periódicamente. Publicaremos actualizaciones importantes en nuestro Discord de soporte: <a href="https://discord.com/invite/dURj8CgbR" target="_blank" rel="noopener noreferrer">Soporte en Discord</a>. El uso continuado de la Extensión después de los cambios constituye la aceptación de la política actualizada.`
        },
        {
          title: "12. Contacto",
          content: `Para preguntas sobre esta Política de Privacidad o sus datos, contáctenos en: <a href="https://discord.com/invite/dURj8CgbR" target="_blank" rel="noopener noreferrer">Discord Support</a>`
        }
      ]
    }
  };

  const t = translations[lang];

  const sectionsHtml = t.sections.map(s => `
    <div class="section">
      <h2>${s.title}</h2>
      <div class="content">${s.content}</div>
    </div>
  `).join('');

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
            color: #fff;
            line-height: 1.6;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 30px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        
        h1 {
            font-size: 32px;
            color: #00d9a5;
            margin-bottom: 10px;
        }
        
        .last-updated {
            color: #666;
            font-size: 14px;
        }
        
        .section {
            margin-bottom: 30px;
            background: rgba(255,255,255,0.03);
            border-radius: 12px;
            padding: 25px;
        }
        
        .section h2 {
            font-size: 18px;
            color: #00d9a5;
            margin-bottom: 15px;
        }
        
        .section .content {
            color: #a0a0a0;
            font-size: 15px;
        }
        
        .section ul {
            margin: 15px 0;
            padding-left: 25px;
        }
        
        .section li {
            margin-bottom: 10px;
        }
        
        .section strong {
            color: #fff;
        }
        
        a {
            color: #00d9a5;
            text-decoration: none;
        }
        
        a:hover {
            text-decoration: underline;
        }
        
        .back-link {
            display: inline-block;
            margin-top: 30px;
            padding: 12px 24px;
            background: rgba(0, 217, 165, 0.1);
            border: 1px solid rgba(0, 217, 165, 0.3);
            border-radius: 8px;
            color: #00d9a5;
            text-decoration: none;
            transition: all 0.2s;
        }
        
        .back-link:hover {
            background: rgba(0, 217, 165, 0.2);
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${t.heading}</h1>
            <p class="last-updated">${t.lastUpdated}</p>
        </div>
        
        ${sectionsHtml}
        
        <a href="javascript:window.close()" class="back-link" onclick="window.close(); return false;">← Close</a>
    </div>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  return res.status(200).send(html);
}
