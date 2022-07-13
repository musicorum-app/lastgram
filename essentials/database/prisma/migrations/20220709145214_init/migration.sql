-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "platformId" VARCHAR(255) NOT NULL,
    "accountId" INTEGER NOT NULL,
    "userPreferencesId" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FMAccount" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "username" VARCHAR(255) NOT NULL,
    "banned" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "FMAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPreferences" (
    "id" SERIAL NOT NULL,
    "sendAsPhoto" BOOLEAN NOT NULL DEFAULT false,
    "addTags" BOOLEAN NOT NULL DEFAULT false,
    "addArtistScrobbles" BOOLEAN NOT NULL DEFAULT false,
    "addAlbumScrobbles" BOOLEAN NOT NULL DEFAULT false,
    "hideName" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_platformId_key" ON "User"("platformId");

-- CreateIndex
CREATE UNIQUE INDEX "User_accountId_key" ON "User"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "User_userPreferencesId_key" ON "User"("userPreferencesId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "FMAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_userPreferencesId_fkey" FOREIGN KEY ("userPreferencesId") REFERENCES "UserPreferences"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
