# FlowForge Pro - API Backend

## Estrutura de Endpoints

```
POST /api/auth/register  - Criar conta
POST /api/auth/login     - Login (com controle de IP)
POST /api/auth/logout    - Logout
POST /api/checkout       - Criar sessão Stripe Checkout
POST /api/webhook        - Webhook do Stripe
GET  /api/license-status - Verificar licença
POST /api/heartbeat      - Validar sessão ativa
```

## Setup

### 1. Supabase

Execute o arquivo `supabase-schema.sql` no SQL Editor do Supabase.

### 2. Stripe

1. Crie um produto com preço recorrente (mensal)
2. Configure o webhook para apontar para: `https://seu-dominio.vercel.app/api/webhook`
3. Eventos do webhook necessários:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

### 3. Vercel

1. Faça deploy do projeto na Vercel
2. Configure as variáveis de ambiente:

```bash
vercel secrets add supabase_url "https://seu-projeto.supabase.co"
vercel secrets add supabase_service_key "sua-service-key"
vercel secrets add stripe_secret_key "sk_live_..."
vercel secrets add stripe_webhook_secret "whsec_..."
```

Ou configure pelo dashboard da Vercel em Settings > Environment Variables.

### 4. Atualizar URL do Webhook no Stripe

Após deploy, atualize a URL do webhook no Stripe Dashboard:
`https://flowforge-backend-nine.vercel.app/api/webhook`

## Fluxo de Uso

```
1. Usuário abre extensão
2. Clica "Criar Conta" → POST /api/auth/register
3. Clica "Começar Trial" → POST /api/checkout
4. Redireciona para Stripe Checkout
5. Stripe processa → POST /api/webhook (ativa licença)
6. Extensão verifica → GET /api/license-status
7. Usuário usa a extensão
8. A cada 1 min → POST /api/heartbeat (valida sessão)
```

## Proteção Anti-Compartilhamento

- Cada login desativa sessões de outros IPs
- Heartbeat verifica conflitos de sessão
- Se detectar uso simultâneo de IPs diferentes, desativa sessão mais antiga

## Proteção Anti-Abuso de Trial

- Fingerprint do dispositivo é registrado
- Mesmo cartão não consegue fazer trial 2x (Stripe nativo)
- Limite de 3 trials por IP a cada 30 dias
- Flag `trial_used` no banco impede múltiplos trials

## Licença

Proprietary - FlowForge Pro
