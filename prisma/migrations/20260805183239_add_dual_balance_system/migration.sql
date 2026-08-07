-- AlterTable
ALTER TABLE "public"."Wallet" ADD COLUMN     "availableBalance" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
ADD COLUMN     "blockchainBalance" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
ADD COLUMN     "internalBalance" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
ADD COLUMN     "lockedBalance" DECIMAL(65,30) NOT NULL DEFAULT 0.0;
