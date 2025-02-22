/*
  Warnings:

  - You are about to drop the column `platformId` on the `FmDisplayName` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fmUsername]` on the table `FmDisplayName` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "FmDisplayName_platformId_key";

-- AlterTable
ALTER TABLE "FmDisplayName" DROP COLUMN "platformId";

-- CreateIndex
CREATE UNIQUE INDEX "FmDisplayName_fmUsername_key" ON "FmDisplayName"("fmUsername");
