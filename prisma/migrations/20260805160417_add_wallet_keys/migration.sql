-- CreateTable
CREATE TABLE "public"."WalletKey" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "encryptedPrivateKey" TEXT NOT NULL,
    "publicKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WalletKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WalletKey_walletId_key" ON "public"."WalletKey"("walletId");

-- AddForeignKey
ALTER TABLE "public"."WalletKey" ADD CONSTRAINT "WalletKey_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "public"."Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
