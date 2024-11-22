/*
  Warnings:

  - A unique constraint covering the columns `[platformId]` on the table `FmDisplayName` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FmDisplayName_platformId_key" ON "FmDisplayName"("platformId");
