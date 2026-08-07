/*
  Warnings:

  - A unique constraint covering the columns `[internalReference]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Transaction" ADD COLUMN     "blockchainNetwork" TEXT,
ADD COLUMN     "blockchainVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "explorerUrl" TEXT,
ADD COLUMN     "internalReference" TEXT,
ADD COLUMN     "transactionSource" TEXT NOT NULL DEFAULT 'INTERNAL';

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_internalReference_key" ON "public"."Transaction"("internalReference");
