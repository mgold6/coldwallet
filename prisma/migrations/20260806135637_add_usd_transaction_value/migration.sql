-- AlterTable
ALTER TABLE "public"."Deposit" ADD COLUMN     "usdAmount" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."Transaction" ADD COLUMN     "exchangeRate" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "usdAmount" DECIMAL(65,30) NOT NULL DEFAULT 0;
