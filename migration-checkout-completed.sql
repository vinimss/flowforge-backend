-- Migração: Adicionar coluna checkout_completed à tabela trial_fingerprints
-- Executar no Supabase SQL Editor

-- Adicionar coluna checkout_completed (default false para registros existentes)
ALTER TABLE trial_fingerprints 
ADD COLUMN IF NOT EXISTS checkout_completed BOOLEAN DEFAULT FALSE;

-- Atualizar registros existentes para marcar como completados
-- (se você já tinha registros, eles provavelmente são de checkouts completados)
UPDATE trial_fingerprints 
SET checkout_completed = TRUE 
WHERE checkout_completed IS NULL OR checkout_completed = FALSE;

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_trial_fingerprints_completed 
ON trial_fingerprints(fingerprint, checkout_completed);

-- Verificar a estrutura atualizada
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'trial_fingerprints';
