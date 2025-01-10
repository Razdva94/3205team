/*
  Warnings:

  - You are about to drop the `Click` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Click" DROP CONSTRAINT "Click_shortUrlId_fkey";

-- DropTable
DROP TABLE "Click";

-- CreateTable
CREATE TABLE "ClickInfo" (
    "id" SERIAL NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shortUrlId" INTEGER NOT NULL,

    CONSTRAINT "ClickInfo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ClickInfo" ADD CONSTRAINT "ClickInfo_shortUrlId_fkey" FOREIGN KEY ("shortUrlId") REFERENCES "ShortUrl"("id") ON DELETE CASCADE ON UPDATE CASCADE;
