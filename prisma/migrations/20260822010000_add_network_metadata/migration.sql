-- CreateEnum
CREATE TYPE "NetworkEnvironment" AS ENUM (
  'MAINNET',
  'TESTNET',
  'DEVNET',
  'PREPROD'
);

-- AlterTable
ALTER TABLE "Network"
ADD COLUMN "blockchain" TEXT NOT NULL DEFAULT 'Unknown',
ADD COLUMN "chainId" TEXT,
ADD COLUMN "environment" "NetworkEnvironment" NOT NULL DEFAULT 'MAINNET',
ADD COLUMN "explorerUrl" TEXT,
ADD COLUMN "isTestnet" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "nativeCurrency" TEXT,
ADD COLUMN "rpcUrl" TEXT;

-- CreateIndex
CREATE INDEX "Network_blockchain_idx" ON "Network"("blockchain");

-- CreateIndex
CREATE INDEX "Network_environment_idx" ON "Network"("environment");

-- Remove the temporary default after existing rows have been populated.
ALTER TABLE "Network"
ALTER COLUMN "blockchain" DROP DEFAULT;
