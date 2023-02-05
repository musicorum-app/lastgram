-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "platformId" TEXT NOT NULL,
    "platformName" TEXT NOT NULL,
    "fmUsername" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en-US',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isBanned" BOOLEAN NOT NULL DEFAULT false,
    "banNote" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_platformId_key" ON "User"("platformId");
