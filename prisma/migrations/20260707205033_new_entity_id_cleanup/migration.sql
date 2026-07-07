/*
  Warnings:

  - You are about to drop the column `mbid` on the `Entity` table. All the data in the column will be lost.
  - You are about to drop the column `displayName` on the `LastFmUser` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[type,externalId]` on the table `Entity` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `externalId` to the `Entity` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Entity_type_mbid_key";

-- AlterTable
ALTER TABLE "Entity" DROP COLUMN "mbid",
ADD COLUMN     "externalId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "LastFmUser" DROP COLUMN "displayName";

-- CreateIndex
CREATE UNIQUE INDEX "Entity_type_externalId_key" ON "Entity"("type", "externalId");
