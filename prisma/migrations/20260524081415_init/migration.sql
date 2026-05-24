/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `passwordHash` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "WaterFeeType" AS ENUM ('INCLUDED', 'NOT_INCLUDED');

-- CreateEnum
CREATE TYPE "ElectricityType" AS ENUM ('INCLUDED', 'TOKEN', 'SEPARATE');

-- CreateEnum
CREATE TYPE "KostStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "GenderType" AS ENUM ('PUTRA', 'PUTRI', 'CAMPUR');

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "passwordHash" TEXT NOT NULL,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'ADMIN',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- DropTable
DROP TABLE "Post";

-- CreateTable
CREATE TABLE "Region" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Facility" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Facility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kost" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "contactWhatsapp" TEXT NOT NULL,
    "priceMonthly" INTEGER,
    "roomSize" TEXT,
    "distanceToCampusInMeters" INTEGER,
    "googleMapsUrl" TEXT,
    "genderType" "GenderType",
    "waterFeeType" "WaterFeeType" NOT NULL DEFAULT 'NOT_INCLUDED',
    "electricityType" "ElectricityType" NOT NULL DEFAULT 'SEPARATE',
    "status" "KostStatus" NOT NULL DEFAULT 'DRAFT',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "regionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "Kost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KostImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "kostId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KostImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KostFacility" (
    "kostId" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,

    CONSTRAINT "KostFacility_pkey" PRIMARY KEY ("kostId","facilityId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Region_name_key" ON "Region"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Region_slug_key" ON "Region"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Facility_name_key" ON "Facility"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Facility_slug_key" ON "Facility"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Kost_slug_key" ON "Kost"("slug");

-- CreateIndex
CREATE INDEX "Kost_regionId_idx" ON "Kost"("regionId");

-- CreateIndex
CREATE INDEX "Kost_status_idx" ON "Kost"("status");

-- CreateIndex
CREATE INDEX "Kost_isFeatured_idx" ON "Kost"("isFeatured");

-- CreateIndex
CREATE INDEX "Kost_priceMonthly_idx" ON "Kost"("priceMonthly");

-- CreateIndex
CREATE INDEX "KostImage_kostId_idx" ON "KostImage"("kostId");

-- CreateIndex
CREATE INDEX "KostFacility_facilityId_idx" ON "KostFacility"("facilityId");

-- AddForeignKey
ALTER TABLE "Kost" ADD CONSTRAINT "Kost_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KostImage" ADD CONSTRAINT "KostImage_kostId_fkey" FOREIGN KEY ("kostId") REFERENCES "Kost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KostFacility" ADD CONSTRAINT "KostFacility_kostId_fkey" FOREIGN KEY ("kostId") REFERENCES "Kost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KostFacility" ADD CONSTRAINT "KostFacility_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE CASCADE ON UPDATE CASCADE;
