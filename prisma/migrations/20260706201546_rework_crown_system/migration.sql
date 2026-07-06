/*
  Warnings:

  - You are about to drop the column `artistId` on the `Crown` table. All the data in the column will be lost.
  - You are about to drop the column `fmUsername` on the `Crown` table. All the data in the column will be lost.
  - You are about to drop the column `playCount` on the `Crown` table. All the data in the column will be lost.
  - You are about to drop the column `artistId` on the `CrownHolder` table. All the data in the column will be lost.
  - You are about to drop the column `fmUsername` on the `CrownHolder` table. All the data in the column will be lost.
  - You are about to drop the column `groupId` on the `CrownHolder` table. All the data in the column will be lost.
  - You are about to drop the column `fmUsername` on the `GroupMember` table. All the data in the column will be lost.
  - You are about to drop the column `fmUsername` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Artist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ArtistScrobble` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FmDisplayName` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[groupId,entityId]` on the table `Crown` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[crownId,userId]` on the table `CrownHolder` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[groupId,userId]` on the table `GroupMember` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `entityId` to the `Crown` table without a default value. This is not possible if the table is not empty.
  - Added the required column `crownId` to the `CrownHolder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `CrownHolder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `GroupMember` table without a default value. This is not possible if the table is not empty.
  - Added the required column `displayName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastFmUsername` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('ARTIST', 'ALBUM', 'TRACK');

-- DropForeignKey
ALTER TABLE "ArtistScrobble" DROP CONSTRAINT "ArtistScrobble_artistId_fkey";

-- DropForeignKey
ALTER TABLE "Crown" DROP CONSTRAINT "Crown_artistId_fkey";

-- DropForeignKey
ALTER TABLE "CrownHolder" DROP CONSTRAINT "CrownHolder_artistId_fkey";

-- DropIndex
DROP INDEX "Crown_artistId_idx";

-- DropIndex
DROP INDEX "Crown_fmUsername_idx";

-- DropIndex
DROP INDEX "Crown_groupId_artistId_key";

-- DropIndex
DROP INDEX "CrownHolder_artistId_idx";

-- DropIndex
DROP INDEX "CrownHolder_fmUsername_idx";

-- DropIndex
DROP INDEX "CrownHolder_groupId_artistId_fmUsername_key";

-- DropIndex
DROP INDEX "CrownHolder_groupId_playCount_idx";

-- DropIndex
DROP INDEX "GroupMember_fmUsername_idx";

-- DropIndex
DROP INDEX "GroupMember_groupId_fmUsername_key";

-- AlterTable
ALTER TABLE "Crown" DROP COLUMN "artistId",
DROP COLUMN "fmUsername",
DROP COLUMN "playCount",
ADD COLUMN     "claimed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "entityId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "CrownHolder" DROP COLUMN "artistId",
DROP COLUMN "fmUsername",
DROP COLUMN "groupId",
ADD COLUMN     "crownId" INTEGER NOT NULL,
ADD COLUMN     "isCurrentHolder" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "GroupMember" DROP COLUMN "fmUsername",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "fmUsername",
ADD COLUMN     "displayName" TEXT NOT NULL,
ADD COLUMN     "lastFmUsername" TEXT NOT NULL,
ADD COLUMN     "private" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Artist";

-- DropTable
DROP TABLE "ArtistScrobble";

-- DropTable
DROP TABLE "FmDisplayName";

-- CreateTable
CREATE TABLE "LastFmUser" (
    "fmUsername" TEXT NOT NULL,
    "displayName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LastFmUser_pkey" PRIMARY KEY ("fmUsername")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "language" TEXT NOT NULL DEFAULT 'en',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entity" (
    "id" SERIAL NOT NULL,
    "mbid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "EntityType" NOT NULL,
    "coverUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Entity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntityScrobble" (
    "id" SERIAL NOT NULL,
    "entityId" INTEGER NOT NULL,
    "fmUsername" TEXT NOT NULL,
    "playCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EntityScrobble_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Entity_type_idx" ON "Entity"("type");

-- CreateIndex
CREATE INDEX "Entity_name_idx" ON "Entity"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Entity_type_mbid_key" ON "Entity"("type", "mbid");

-- CreateIndex
CREATE INDEX "EntityScrobble_fmUsername_idx" ON "EntityScrobble"("fmUsername");

-- CreateIndex
CREATE INDEX "EntityScrobble_playCount_idx" ON "EntityScrobble"("playCount" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "EntityScrobble_fmUsername_entityId_key" ON "EntityScrobble"("fmUsername", "entityId");

-- CreateIndex
CREATE INDEX "Crown_entityId_idx" ON "Crown"("entityId");

-- CreateIndex
CREATE UNIQUE INDEX "Crown_groupId_entityId_key" ON "Crown"("groupId", "entityId");

-- CreateIndex
CREATE INDEX "CrownHolder_userId_idx" ON "CrownHolder"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CrownHolder_crownId_userId_key" ON "CrownHolder"("crownId", "userId");

-- CreateIndex
CREATE INDEX "GroupMember_userId_idx" ON "GroupMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "GroupMember_groupId_userId_key" ON "GroupMember"("groupId", "userId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_lastFmUsername_fkey" FOREIGN KEY ("lastFmUsername") REFERENCES "LastFmUser"("fmUsername") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityScrobble" ADD CONSTRAINT "EntityScrobble_fmUsername_fkey" FOREIGN KEY ("fmUsername") REFERENCES "LastFmUser"("fmUsername") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityScrobble" ADD CONSTRAINT "EntityScrobble_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Crown" ADD CONSTRAINT "Crown_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Crown" ADD CONSTRAINT "Crown_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrownHolder" ADD CONSTRAINT "CrownHolder_crownId_fkey" FOREIGN KEY ("crownId") REFERENCES "Crown"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrownHolder" ADD CONSTRAINT "CrownHolder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
