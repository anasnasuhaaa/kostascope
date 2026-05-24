/*
  Warnings:

  - You are about to drop the column `priceMonthly` on the `Kost` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "RentPriceType" AS ENUM ('MONTHLY', 'SIX_MONTHS', 'YEARLY');

-- DropIndex
DROP INDEX "Kost_priceMonthly_idx";

-- AlterTable
ALTER TABLE "Kost" DROP COLUMN "priceMonthly";

-- CreateTable
CREATE TABLE "KostPrice" (
    "id" TEXT NOT NULL,
    "type" "RentPriceType" NOT NULL,
    "price" INTEGER NOT NULL,
    "kostId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KostPrice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "KostPrice_kostId_idx" ON "KostPrice"("kostId");

-- CreateIndex
CREATE UNIQUE INDEX "KostPrice_kostId_type_key" ON "KostPrice"("kostId", "type");

-- AddForeignKey
ALTER TABLE "KostPrice" ADD CONSTRAINT "KostPrice_kostId_fkey" FOREIGN KEY ("kostId") REFERENCES "Kost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
