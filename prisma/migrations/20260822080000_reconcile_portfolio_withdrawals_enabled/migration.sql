-- Reconcile Portfolio.withdrawalsEnabled.
-- The column already exists in the live database.
-- This migration records the schema state without
-- changing existing values.

ALTER TABLE "Portfolio"
ADD COLUMN IF NOT EXISTS "withdrawalsEnabled" BOOLEAN NOT NULL DEFAULT true;
