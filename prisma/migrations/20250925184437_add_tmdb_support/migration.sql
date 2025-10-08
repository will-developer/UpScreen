/*
  Warnings:

  - A unique constraint covering the columns `[tmdbId]` on the table `Title` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Title" ADD COLUMN     "backdropPath" TEXT,
ADD COLUMN     "posterPath" TEXT,
ADD COLUMN     "tmdbId" INTEGER,
ADD COLUMN     "tmdbRating" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "tmdbVoteCount" INTEGER DEFAULT 0,
ADD COLUMN     "type" TEXT DEFAULT 'movie';

-- AlterTable
ALTER TABLE "public"."Vote" ADD COLUMN     "rating" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "Title_tmdbId_key" ON "public"."Title"("tmdbId");
