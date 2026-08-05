-- AlterTable
ALTER TABLE "public"."Deposit" ADD COLUMN     "confirmedAt" TIMESTAMP(3),
ADD COLUMN     "creditedAt" TIMESTAMP(3),
ADD COLUMN     "depositDate" TIMESTAMP(3),
ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "public"."Transaction" ADD COLUMN     "confirmedAt" TIMESTAMP(3),
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "transactionDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."Wallet" ADD COLUMN     "assignedAt" TIMESTAMP(3),
ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "public"."Withdrawal" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "processedAt" TIMESTAMP(3),
ADD COLUMN     "requestedAt" TIMESTAMP(3);
