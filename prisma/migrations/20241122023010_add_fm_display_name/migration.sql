-- CreateTable
CREATE TABLE "FmDisplayName" (
    "id" SERIAL NOT NULL,
    "fmUsername" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "platformId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FmDisplayName_pkey" PRIMARY KEY ("id")
);
