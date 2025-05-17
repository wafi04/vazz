/*
  Warnings:

  - Added the required column `hargaFromDigi` to the `layanans` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "layanans" ADD COLUMN     "hargaFromDigi" INTEGER NOT NULL;
