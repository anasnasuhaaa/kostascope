-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateTable
CREATE TABLE "ContactServiceSetting" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Jakarta',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactServiceSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactServiceSchedule" (
    "id" TEXT NOT NULL,
    "day" "DayOfWeek" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startMinute" INTEGER NOT NULL,
    "endMinute" INTEGER NOT NULL,
    "settingId" TEXT NOT NULL,

    CONSTRAINT "ContactServiceSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContactServiceSchedule_settingId_idx" ON "ContactServiceSchedule"("settingId");

-- CreateIndex
CREATE UNIQUE INDEX "ContactServiceSchedule_settingId_day_key" ON "ContactServiceSchedule"("settingId", "day");

-- AddForeignKey
ALTER TABLE "ContactServiceSchedule" ADD CONSTRAINT "ContactServiceSchedule_settingId_fkey" FOREIGN KEY ("settingId") REFERENCES "ContactServiceSetting"("id") ON DELETE CASCADE ON UPDATE CASCADE;
