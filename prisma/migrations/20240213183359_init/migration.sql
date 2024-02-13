-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'BOSS', 'USER');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "bossId" INTEGER,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_bossId_fkey" FOREIGN KEY ("bossId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
