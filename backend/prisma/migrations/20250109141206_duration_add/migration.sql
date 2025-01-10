/*
  Warnings:

  - You are about to drop the column `expieresAt` on the `ShortUrl` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ShortUrl" DROP COLUMN "expieresAt",
ADD COLUMN     "expiresAt" TIMESTAMP(3);
