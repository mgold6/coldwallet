-- DropForeignKey
ALTER TABLE "public"."Wallet" DROP CONSTRAINT "Wallet_currencyId_fkey";

-- AlterTable
ALTER TABLE "public"."Portfolio" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "public"."Wallet" ADD CONSTRAINT "Wallet_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "public"."Currency"("id") ON DELETE CASCADE ON UPDATE CASCADE;
