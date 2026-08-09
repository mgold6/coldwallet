-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "selectedPortfolioId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_selectedPortfolioId_fkey" FOREIGN KEY ("selectedPortfolioId") REFERENCES "public"."Portfolio"("id") ON DELETE SET NULL ON UPDATE CASCADE;
