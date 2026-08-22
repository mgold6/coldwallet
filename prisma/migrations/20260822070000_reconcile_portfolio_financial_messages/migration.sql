-- Reconcile Portfolio financial-message columns
-- These columns already exist in the live database.
-- IF NOT EXISTS makes this migration safe to apply.

ALTER TABLE "Portfolio"
ADD COLUMN IF NOT EXISTS "withdrawalSuccessMessage" TEXT;

ALTER TABLE "Portfolio"
ADD COLUMN IF NOT EXISTS "withdrawalErrorMessage" TEXT;
