-- AlterTable
ALTER TABLE "User" ADD COLUMN     "likedEmoji" TEXT NOT NULL DEFAULT '❤️',
ADD COLUMN     "sendPhotosAsLink" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sendTags" BOOLEAN NOT NULL DEFAULT false;
