-- AlterTable
ALTER TABLE "User" ALTER COLUMN "sendPhotosAsLink" SET DEFAULT false;

-- CreateTable
CREATE TABLE "Artist" (
    "mbid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "coverUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("mbid")
);

-- CreateTable
CREATE TABLE "ArtistScrobble" (
    "id" SERIAL NOT NULL,
    "fmUsername" TEXT NOT NULL,
    "artistMbid" TEXT NOT NULL,
    "playCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArtistScrobble_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupMember" (
    "id" SERIAL NOT NULL,
    "groupId" TEXT NOT NULL,
    "fmUsername" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GroupMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Crown" (
    "id" SERIAL NOT NULL,
    "groupId" TEXT NOT NULL,
    "artistMbid" TEXT NOT NULL,
    "fmUsername" TEXT NOT NULL,
    "playCount" INTEGER NOT NULL,
    "switchedTimes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Crown_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ArtistScrobble_fmUsername_artistMbid_key" ON "ArtistScrobble"("fmUsername", "artistMbid");

-- CreateIndex
CREATE INDEX "GroupMember_groupId_idx" ON "GroupMember"("groupId");

-- CreateIndex
CREATE UNIQUE INDEX "GroupMember_groupId_fmUsername_key" ON "GroupMember"("groupId", "fmUsername");

-- CreateIndex
CREATE INDEX "Crown_groupId_idx" ON "Crown"("groupId");

-- CreateIndex
CREATE UNIQUE INDEX "Crown_groupId_artistMbid_key" ON "Crown"("groupId", "artistMbid");
