/*
  Warnings:

  - You are about to drop the column `isAdmin` on the `league_members` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "league_role" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- AlterTable
ALTER TABLE "league_members" DROP COLUMN "isAdmin",
ADD COLUMN     "role" "league_role" NOT NULL DEFAULT 'MEMBER';
