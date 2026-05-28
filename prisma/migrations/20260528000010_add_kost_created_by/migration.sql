-- AlterTable
ALTER TABLE "Kost" ADD COLUMN     "createdById" TEXT;

-- AddForeignKey
ALTER TABLE "Kost" ADD CONSTRAINT "Kost_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
