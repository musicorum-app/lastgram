/*
  Warnings:

  - You are about to drop the column `artistMbid` on the `ArtistScrobble` table. All the data in the column will be lost.
  - You are about to drop the column `artistMbid` on the `Crown` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fmUsername,artistId]` on the table `ArtistScrobble` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[groupId,artistId]` on the table `Crown` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `artistId` to the `ArtistScrobble` table without a default value. This is not possible if the table is not empty.
  - Added the required column `artistId` to the `Crown` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ArtistScrobble_fmUsername_artistMbid_key";

-- DropIndex
DROP INDEX "Crown_groupId_artistMbid_key";

-- AlterTable
ALTER TABLE "ArtistScrobble" DROP COLUMN "artistMbid",
ADD COLUMN     "artistId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Crown" DROP COLUMN "artistMbid",
ADD COLUMN     "artistId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "CrownHolder" (
    "id" SERIAL NOT NULL,
    "groupId" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "fmUsername" TEXT NOT NULL,
    "playCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CrownHolder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CrownHolder_groupId_playCount_idx" ON "CrownHolder"("groupId", "playCount" DESC);

-- CreateIndex
CREATE INDEX "CrownHolder_artistId_idx" ON "CrownHolder"("artistId");

-- CreateIndex
CREATE INDEX "CrownHolder_fmUsername_idx" ON "CrownHolder"("fmUsername");

-- CreateIndex
CREATE UNIQUE INDEX "CrownHolder_groupId_artistId_fmUsername_key" ON "CrownHolder"("groupId", "artistId", "fmUsername");

-- CreateIndex
CREATE INDEX "Artist_name_idx" ON "Artist"("name");

-- CreateIndex
CREATE INDEX "ArtistScrobble_fmUsername_idx" ON "ArtistScrobble"("fmUsername");

-- CreateIndex
CREATE INDEX "ArtistScrobble_playCount_idx" ON "ArtistScrobble"("playCount" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "ArtistScrobble_fmUsername_artistId_key" ON "ArtistScrobble"("fmUsername", "artistId");

-- CreateIndex
CREATE INDEX "Crown_artistId_idx" ON "Crown"("artistId");

-- CreateIndex
CREATE INDEX "Crown_fmUsername_idx" ON "Crown"("fmUsername");

-- CreateIndex
CREATE UNIQUE INDEX "Crown_groupId_artistId_key" ON "Crown"("groupId", "artistId");

-- CreateIndex
CREATE INDEX "GroupMember_fmUsername_idx" ON "GroupMember"("fmUsername");

-- AddForeignKey
ALTER TABLE "ArtistScrobble" ADD CONSTRAINT "ArtistScrobble_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("mbid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Crown" ADD CONSTRAINT "Crown_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("mbid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrownHolder" ADD CONSTRAINT "CrownHolder_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("mbid") ON DELETE CASCADE ON UPDATE CASCADE;
