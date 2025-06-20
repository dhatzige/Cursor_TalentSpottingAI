/*
  Warnings:

  - Added the required column `coverLetter` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resumePath` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ApplicationStatus" ADD VALUE 'REVIEWING';
ALTER TYPE "ApplicationStatus" ADD VALUE 'INTERVIEW';

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "additionalInfo" TEXT,
ADD COLUMN     "coverLetter" TEXT NOT NULL,
ADD COLUMN     "resumePath" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
