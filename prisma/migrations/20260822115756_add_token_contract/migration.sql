-- CreateTable
CREATE TABLE "TokenContract" (
    "id" TEXT NOT NULL,
    "currencyId" TEXT NOT NULL,
    "networkId" TEXT NOT NULL,
    "contractAddress" TEXT NOT NULL,
    "symbol" TEXT,
    "decimals" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TokenContract_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TokenContract_networkId_idx" ON "TokenContract"("networkId");

-- CreateIndex
CREATE INDEX "TokenContract_contractAddress_idx" ON "TokenContract"("contractAddress");

-- CreateIndex
CREATE UNIQUE INDEX "TokenContract_currencyId_networkId_key" ON "TokenContract"("currencyId", "networkId");

-- AddForeignKey
ALTER TABLE "TokenContract" ADD CONSTRAINT "TokenContract_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenContract" ADD CONSTRAINT "TokenContract_networkId_fkey" FOREIGN KEY ("networkId") REFERENCES "Network"("id") ON DELETE CASCADE ON UPDATE CASCADE;
