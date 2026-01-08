// api/terms.js
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
      title: "Terms of Use - FlowForge Pro",
      heading: "Terms of Use",
      lastUpdated: "Last updated: January 2026",
      sections: [
        {
          title: "1. Acceptance of Terms",
          content: `By accessing or using FlowForge Pro ("the Extension"), you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use the Extension.`
        },
        {
          title: "2. Description of Service",
          content: `FlowForge Pro is a browser extension that automates prompt submission and video downloading on Google Flow. The Extension requires an active subscription to function.`
        },
        {
          title: "3. Subscription and Payments",
          content: `<ul>
            <li>The Extension offers a 1-day free trial, followed by a monthly subscription of $9.90 USD.</li>
            <li>The free trial is limited to one per device. Attempting to circumvent this limitation may result in account termination.</li>
            <li>Payments are processed securely through Stripe.</li>
            <li>You may cancel your subscription at any time through the Stripe customer portal. Access will continue until the end of the current billing period.</li>
            <li>No refunds will be provided for partial months or unused time.</li>
          </ul>`
        },
        {
          title: "4. Acceptable Use",
          content: `You agree to use the Extension only for lawful purposes and in accordance with these Terms. You agree NOT to:
          <ul>
            <li>Use the Extension in any way that violates applicable laws or regulations.</li>
            <li>Attempt to bypass, disable, or interfere with security features of the Extension.</li>
            <li>Share your account credentials with others.</li>
            <li>Use multiple accounts to obtain additional free trials.</li>
            <li>Reverse engineer, decompile, or disassemble the Extension.</li>
            <li>Use the Extension for any commercial purpose without authorization.</li>
          </ul>`
        },
        {
          title: "5. Account Security",
          content: `<ul>
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            <li>You must notify us immediately of any unauthorized use of your account.</li>
            <li>For security, only one active session is allowed per account. Logging in from a new device will terminate previous sessions.</li>
          </ul>`
        },
        {
          title: "6. Intellectual Property",
          content: `The Extension, including its code, design, and content, is protected by intellectual property laws. You are granted a limited, non-exclusive, non-transferable license to use the Extension for personal purposes only.`
        },
        {
          title: "7. Disclaimer of Warranties",
          content: `THE EXTENSION IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE THAT THE EXTENSION WILL BE UNINTERRUPTED, ERROR-FREE, OR COMPATIBLE WITH ALL SYSTEMS OR THIRD-PARTY SERVICES.`
        },
        {
          title: "8. Limitation of Liability",
          content: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE EXTENSION.`
        },
        {
          title: "9. Third-Party Services",
          content: `The Extension interacts with third-party services (Google Flow, Stripe). We are not responsible for the availability, content, or practices of these services. Your use of third-party services is subject to their respective terms and policies.`
        },
        {
          title: "10. Modifications",
          content: `We reserve the right to modify these Terms at any time. Continued use of the Extension after changes constitutes acceptance of the new Terms. We will post significant updates in our Discord support channel: <a href="https://discord.com/invite/dURj8CgbR" target="_blank" rel="noopener noreferrer">Discord Support</a>.`
        },
        {
          title: "11. Termination",
          content: `We may suspend or terminate your access to the Extension at any time, with or without cause, including for violation of these Terms. Upon termination, your right to use the Extension will immediately cease.`
        },
        {
          title: "12. Contact",
          content: `For questions about these Terms, please contact us at: <a href="https://discord.com/invite/dURj8CgbR" target="_blank" rel="noopener noreferrer">Discord Support</a>`
        }
      ]
    },
    pt: {
      title: "Termos de Uso - FlowForge Pro",
      heading: "Termos de Uso",
      lastUpdated: "Última atualização: Janeiro de 2026",
      sections: [
        {
          title: "1. Aceitação dos Termos",
          content: `Ao acessar ou usar o FlowForge Pro ("a Extensão"), você concorda em estar vinculado a estes Termos de Uso. Se você não concordar com estes termos, por favor não use a Extensão.`
        },
        {
          title: "2. Descrição do Serviço",
          content: `O FlowForge Pro é uma extensão de navegador que automatiza o envio de prompts e download de vídeos no Google Flow. A Extensão requer uma assinatura ativa para funcionar.`
        },
        {
          title: "3. Assinatura e Pagamentos",
          content: `<ul>
            <li>A Extensão oferece um teste grátis de 1 dia, seguido por uma assinatura mensal de 9,90 USD.</li>
            <li>O teste grátis é limitado a um por dispositivo. Tentar contornar essa limitação pode resultar no encerramento da conta.</li>
            <li>Os pagamentos são processados de forma segura através do Stripe.</li>
            <li>Você pode cancelar sua assinatura a qualquer momento através do portal do cliente Stripe. O acesso continuará até o final do período de faturamento atual.</li>
            <li>Não serão fornecidos reembolsos para meses parciais ou tempo não utilizado.</li>
          </ul>`
        },
        {
          title: "4. Uso Aceitável",
          content: `Você concorda em usar a Extensão apenas para fins legais e de acordo com estes Termos. Você concorda em NÃO:
          <ul>
            <li>Usar a Extensão de qualquer forma que viole leis ou regulamentos aplicáveis.</li>
            <li>Tentar contornar, desativar ou interferir com recursos de segurança da Extensão.</li>
            <li>Compartilhar suas credenciais de conta com terceiros.</li>
            <li>Usar múltiplas contas para obter testes grátis adicionais.</li>
            <li>Fazer engenharia reversa, descompilar ou desmontar a Extensão.</li>
            <li>Usar a Extensão para qualquer propósito comercial sem autorização.</li>
          </ul>`
        },
        {
          title: "5. Segurança da Conta",
          content: `<ul>
            <li>Você é responsável por manter a confidencialidade das credenciais da sua conta.</li>
            <li>Você deve nos notificar imediatamente sobre qualquer uso não autorizado da sua conta.</li>
            <li>Por segurança, apenas uma sessão ativa é permitida por conta. Fazer login em um novo dispositivo encerrará sessões anteriores.</li>
          </ul>`
        },
        {
          title: "6. Propriedade Intelectual",
          content: `A Extensão, incluindo seu código, design e conteúdo, é protegida por leis de propriedade intelectual. Você recebe uma licença limitada, não exclusiva e intransferível para usar a Extensão apenas para fins pessoais.`
        },
        {
          title: "7. Isenção de Garantias",
          content: `A EXTENSÃO É FORNECIDA "COMO ESTÁ" SEM GARANTIAS DE QUALQUER TIPO. NÃO GARANTIMOS QUE A EXTENSÃO SERÁ ININTERRUPTA, LIVRE DE ERROS OU COMPATÍVEL COM TODOS OS SISTEMAS OU SERVIÇOS DE TERCEIROS.`
        },
        {
          title: "8. Limitação de Responsabilidade",
          content: `ATÉ O MÁXIMO PERMITIDO POR LEI, NÃO SEREMOS RESPONSÁVEIS POR QUAISQUER DANOS INDIRETOS, INCIDENTAIS, ESPECIAIS, CONSEQUENCIAIS OU PUNITIVOS DECORRENTES DO SEU USO DA EXTENSÃO.`
        },
        {
          title: "9. Serviços de Terceiros",
          content: `A Extensão interage com serviços de terceiros (Google Flow, Stripe). Não somos responsáveis pela disponibilidade, conteúdo ou práticas desses serviços. Seu uso de serviços de terceiros está sujeito aos respectivos termos e políticas.`
        },
        {
          title: "10. Modificações",
          content: `Reservamo-nos o direito de modificar estes Termos a qualquer momento. O uso continuado da Extensão após alterações constitui aceitação dos novos Termos. Publicaremos atualizações significativas no nosso Discord de suporte: <a href="https://discord.com/invite/dURj8CgbR" target="_blank" rel="noopener noreferrer">Suporte no Discord</a>.`
        },
        {
          title: "11. Rescisão",
          content: `Podemos suspender ou encerrar seu acesso à Extensão a qualquer momento, com ou sem causa, incluindo por violação destes Termos. Após a rescisão, seu direito de usar a Extensão cessará imediatamente.`
        },
        {
          title: "12. Contato",
          content: `Para perguntas sobre estes Termos, entre em contato conosco em: <a href="https://discord.com/invite/dURj8CgbR" target="_blank" rel="noopener noreferrer">Discord Support</a>`
        }
      ]
    },
    es: {
      title: "Términos de Uso - FlowForge Pro",
      heading: "Términos de Uso",
      lastUpdated: "Última actualización: Enero de 2026",
      sections: [
        {
          title: "1. Aceptación de los Términos",
          content: `Al acceder o usar FlowForge Pro ("la Extensión"), usted acepta estar sujeto a estos Términos de Uso. Si no está de acuerdo con estos términos, por favor no use la Extensión.`
        },
        {
          title: "2. Descripción del Servicio",
          content: `FlowForge Pro es una extensión de navegador que automatiza el envío de prompts y la descarga de videos en Google Flow. La Extensión requiere una suscripción activa para funcionar.`
        },
        {
          title: "3. Suscripción y Pagos",
          content: `<ul>
            <li>La Extensión ofrece una prueba gratuita de 1 día, seguida de una suscripción mensual de 9.90 USD.</li>
            <li>La prueba gratuita está limitada a una por dispositivo. Intentar eludir esta limitación puede resultar en la terminación de la cuenta.</li>
            <li>Los pagos se procesan de forma segura a través de Stripe.</li>
            <li>Puede cancelar su suscripción en cualquier momento a través del portal de cliente de Stripe. El acceso continuará hasta el final del período de facturación actual.</li>
            <li>No se proporcionarán reembolsos por meses parciales o tiempo no utilizado.</li>
          </ul>`
        },
        {
          title: "4. Uso Aceptable",
          content: `Usted acepta usar la Extensión solo para fines legales y de acuerdo con estos Términos. Usted acepta NO:
          <ul>
            <li>Usar la Extensión de cualquier manera que viole las leyes o regulaciones aplicables.</li>
            <li>Intentar eludir, desactivar o interferir con las funciones de seguridad de la Extensión.</li>
            <li>Compartir las credenciales de su cuenta con otros.</li>
            <li>Usar múltiples cuentas para obtener pruebas gratuitas adicionales.</li>
            <li>Realizar ingeniería inversa, descompilar o desensamblar la Extensión.</li>
            <li>Usar la Extensión para cualquier propósito comercial sin autorización.</li>
          </ul>`
        },
        {
          title: "5. Seguridad de la Cuenta",
          content: `<ul>
            <li>Usted es responsable de mantener la confidencialidad de las credenciales de su cuenta.</li>
            <li>Debe notificarnos inmediatamente sobre cualquier uso no autorizado de su cuenta.</li>
            <li>Por seguridad, solo se permite una sesión activa por cuenta. Iniciar sesión desde un nuevo dispositivo terminará las sesiones anteriores.</li>
          </ul>`
        },
        {
          title: "6. Propiedad Intelectual",
          content: `La Extensión, incluyendo su código, diseño y contenido, está protegida por leyes de propiedad intelectual. Se le otorga una licencia limitada, no exclusiva e intransferible para usar la Extensión solo para fines personales.`
        },
        {
          title: "7. Descargo de Garantías",
          content: `LA EXTENSIÓN SE PROPORCIONA "TAL CUAL" SIN GARANTÍAS DE NINGÚN TIPO. NO GARANTIZAMOS QUE LA EXTENSIÓN SERÁ ININTERRUMPIDA, LIBRE DE ERRORES O COMPATIBLE CON TODOS LOS SISTEMAS O SERVICIOS DE TERCEROS.`
        },
        {
          title: "8. Limitación de Responsabilidad",
          content: `HASTA EL MÁXIMO PERMITIDO POR LA LEY, NO SEREMOS RESPONSABLES DE NINGÚN DAÑO INDIRECTO, INCIDENTAL, ESPECIAL, CONSECUENTE O PUNITIVO QUE SURJA DE SU USO DE LA EXTENSIÓN.`
        },
        {
          title: "9. Servicios de Terceros",
          content: `La Extensión interactúa con servicios de terceros (Google Flow, Stripe). No somos responsables de la disponibilidad, contenido o prácticas de estos servicios. Su uso de servicios de terceros está sujeto a sus respectivos términos y políticas.`
        },
        {
          title: "10. Modificaciones",
          content: `Nos reservamos el derecho de modificar estos Términos en cualquier momento. El uso continuado de la Extensión después de los cambios constituye la aceptación de los nuevos Términos. Publicaremos actualizaciones importantes en nuestro Discord de soporte: <a href="https://discord.com/invite/dURj8CgbR" target="_blank" rel="noopener noreferrer">Soporte en Discord</a>.`
        },
        {
          title: "11. Terminación",
          content: `Podemos suspender o terminar su acceso a la Extensión en cualquier momento, con o sin causa, incluyendo por violación de estos Términos. Tras la terminación, su derecho a usar la Extensión cesará inmediatamente.`
        },
        {
          title: "12. Contacto",
          content: `Para preguntas sobre estos Términos, contáctenos en: <a href="https://discord.com/invite/dURj8CgbR" target="_blank" rel="noopener noreferrer">Discord Support</a>`
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
