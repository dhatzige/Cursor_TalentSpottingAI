/*
  Warnings:

  - A unique constraint covering the columns `[dashboardCode]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dashboardCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_dashboardCode_key" ON "User"("dashboardCode");
