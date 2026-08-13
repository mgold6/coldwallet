-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "manualFundsWithdrawable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "withdrawalRestrictionMessage" TEXT,
ADD COLUMN     "withdrawalsEnabled" BOOLEAN NOT NULL DEFAULT true;
