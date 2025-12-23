-- FlowForge Pro (MVP) - tabela de licenças
-- 1) Crie a tabela licenses
create table if not exists public.licenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  active boolean not null default true,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) Garantir 1 licença por usuário (opcional, mas recomendado)
create unique index if not exists licenses_user_id_unique on public.licenses(user_id);

-- 3) Trigger para updated_at (opcional)
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_set_updated_at on public.licenses;
create trigger trg_set_updated_at
before update on public.licenses
for each row execute function public.set_updated_at();

-- Observação: no MVP, você pode deixar RLS desativado nessa tabela,
-- pois a API usa SERVICE_ROLE_KEY (server-side). Se preferir ativar RLS:
-- alter table public.licenses enable row level security;
