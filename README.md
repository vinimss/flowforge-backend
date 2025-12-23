# FlowForge Pro - License API (MVP)

Esta é uma API mínima (Vercel) para:
- POST /login  -> autentica no Supabase Auth e retorna um token próprio + status de licença
- GET  /validate -> valida token próprio e retorna ok/expires_at

## 1) Criar Supabase
1. Crie um projeto no Supabase
2. Em **SQL Editor**, rode o arquivo `schema.sql`
3. Crie usuários em **Authentication > Users** (email + senha)

## 2) Criar/renovar licença (manual)
No Supabase (Table editor), em `licenses` crie/atualize:
- user_id = id do usuário
- active = true
- expires_at = NOW() + interval '30 days' (ex: 2026-01-21T00:00:00Z)

## 3) Deploy na Vercel
- Suba esta pasta para um GitHub repo
- Na Vercel, importe o repo e configure as env vars:

Env Vars obrigatórias:
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- JWT_SECRET (uma string longa, ex: 32+ chars)

Deploy e pegue sua URL:
Ex: https://flowforge-license-api.vercel.app

## 4) Configurar a extensão
Na aba ⚙️ Configurações, defina:
API Base URL = https://flowforge-license-api.vercel.app/api

Pronto.
