-- =====================================================
-- FLOWFORGE PRO - SUPABASE SCHEMA
-- Execute este SQL no Supabase SQL Editor
-- =====================================================

-- 1. Tabela de usuários (se não existir)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Adicionar colunas na tabela licenses (se não existirem)
ALTER TABLE licenses 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS plan_type TEXT DEFAULT 'trial', -- 'trial', 'monthly', 'yearly'
ADD COLUMN IF NOT EXISTS trial_used BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS canceled_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Criar índice para busca por email
CREATE INDEX IF NOT EXISTS idx_licenses_email ON licenses(email);
CREATE INDEX IF NOT EXISTS idx_licenses_stripe_customer ON licenses(stripe_customer_id);

-- 3. Tabela para rastrear fingerprints que já usaram trial
CREATE TABLE IF NOT EXISTS trial_fingerprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fingerprint TEXT NOT NULL,
  email TEXT,
  ip_address TEXT,
  user_agent TEXT,
  used_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(fingerprint)
);

CREATE INDEX IF NOT EXISTS idx_trial_fingerprints_fp ON trial_fingerprints(fingerprint);
CREATE INDEX IF NOT EXISTS idx_trial_fingerprints_ip ON trial_fingerprints(ip_address);

-- 4. Tabela para controle de sessões ativas (anti-compartilhamento)
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  license_id UUID REFERENCES licenses(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  ip_address TEXT NOT NULL,
  user_agent TEXT,
  fingerprint TEXT,
  last_heartbeat TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON user_sessions(user_id, is_active);

-- 5. Tabela de logs de eventos (opcional, para debug)
CREATE TABLE IF NOT EXISTS event_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL, -- 'login', 'logout', 'session_conflict', 'payment', 'webhook'
  user_id UUID,
  email TEXT,
  ip_address TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_logs_user ON event_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_event_logs_type ON event_logs(event_type);

-- 6. Função para limpar sessões antigas (executar via cron ou manualmente)
CREATE OR REPLACE FUNCTION cleanup_old_sessions()
RETURNS void AS $$
BEGIN
  -- Marca como inativa sessões sem heartbeat há mais de 5 minutos
  UPDATE user_sessions 
  SET is_active = FALSE 
  WHERE is_active = TRUE 
  AND last_heartbeat < NOW() - INTERVAL '5 minutes';
  
  -- Delete sessões inativas há mais de 24 horas
  DELETE FROM user_sessions 
  WHERE is_active = FALSE 
  AND last_heartbeat < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- 7. Função para verificar se fingerprint já usou trial
CREATE OR REPLACE FUNCTION check_trial_eligibility(
  p_fingerprint TEXT,
  p_ip_address TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  fingerprint_exists BOOLEAN;
  ip_trial_count INTEGER;
BEGIN
  -- Verifica se fingerprint já existe
  SELECT EXISTS(
    SELECT 1 FROM trial_fingerprints WHERE fingerprint = p_fingerprint
  ) INTO fingerprint_exists;
  
  IF fingerprint_exists THEN
    RETURN FALSE;
  END IF;
  
  -- Verifica quantos trials foram feitos do mesmo IP (limite: 3)
  SELECT COUNT(*) INTO ip_trial_count
  FROM trial_fingerprints 
  WHERE ip_address = p_ip_address
  AND used_at > NOW() - INTERVAL '30 days';
  
  IF ip_trial_count >= 3 THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- 8. Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger nas tabelas
DROP TRIGGER IF EXISTS licenses_updated_at ON licenses;
CREATE TRIGGER licenses_updated_at
  BEFORE UPDATE ON licenses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS users_updated_at ON users;
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 9. RLS (Row Level Security) - Opcional mas recomendado
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PRONTO! Execute este SQL no Supabase SQL Editor
-- =====================================================
