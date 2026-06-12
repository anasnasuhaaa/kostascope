-- CreateTable
CREATE TABLE "RegionPublicRelation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "assignmentCount" INTEGER NOT NULL DEFAULT 0,
    "lastAssignedAt" TIMESTAMP(3),
    "regionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RegionPublicRelation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RegionPublicRelation_regionId_idx" ON "RegionPublicRelation"("regionId");

-- CreateIndex
CREATE INDEX "RegionPublicRelation_regionId_isActive_idx" ON "RegionPublicRelation"("regionId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "RegionPublicRelation_regionId_whatsapp_key" ON "RegionPublicRelation"("regionId", "whatsapp");

-- AddForeignKey
ALTER TABLE "RegionPublicRelation" ADD CONSTRAINT "RegionPublicRelation_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE CASCADE ON UPDATE CASCADE;
