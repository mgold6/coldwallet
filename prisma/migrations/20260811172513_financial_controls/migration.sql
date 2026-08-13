-- CreateEnum
CREATE TYPE "public"."WithdrawalStatus" AS ENUM ('PENDING_REVIEW', 'APPROVED', 'DECLINED', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- AlterTable
ALTER TABLE "public"."Wallet" ADD COLUMN     "reservedWithdrawalBalance" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
ADD COLUMN     "withdrawalLocked" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."Withdrawal" ADD COLUMN     "declineReason" TEXT,
ADD COLUMN     "manualFunds" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ADD COLUMN     "reviewedById" TEXT,
ADD COLUMN     "status" "public"."WithdrawalStatus" NOT NULL DEFAULT 'PENDING_REVIEW';

-- AddForeignKey
ALTER TABLE "public"."Withdrawal" ADD CONSTRAINT "Withdrawal_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
