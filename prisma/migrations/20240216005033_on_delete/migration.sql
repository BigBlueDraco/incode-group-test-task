-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_bossId_fkey";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_bossId_fkey" FOREIGN KEY ("bossId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
