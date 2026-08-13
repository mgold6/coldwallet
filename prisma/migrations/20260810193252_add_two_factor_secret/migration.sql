/*
  Warnings:

  - You are about to drop the `Subscriber` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "twoFactorSecret" TEXT;

-- DropTable
DROP TABLE "public"."Subscriber";
