/*
  Warnings:

  - You are about to drop the column `role` on the `OrganizationInvite` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `OrganizationMember` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OrganizationInvite" DROP COLUMN "role";

-- AlterTable
ALTER TABLE "OrganizationMember" DROP COLUMN "role";

-- DropEnum
DROP TYPE "MemberRole";

-- CreateTable
CREATE TABLE "StudentProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "bio" TEXT,
    "studyField" TEXT NOT NULL,
    "studyLevel" TEXT NOT NULL,
    "graduationYear" INTEGER NOT NULL,
    "skills" TEXT[],
    "locationId" TEXT,
    "locationName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentProfile_userId_key" ON "StudentProfile"("userId");

-- CreateIndex
CREATE INDEX "StudentProfile_studyField_idx" ON "StudentProfile"("studyField");

-- CreateIndex
CREATE INDEX "StudentProfile_studyLevel_idx" ON "StudentProfile"("studyLevel");

-- CreateIndex
CREATE INDEX "StudentProfile_locationId_idx" ON "StudentProfile"("locationId");

-- AddForeignKey
ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
