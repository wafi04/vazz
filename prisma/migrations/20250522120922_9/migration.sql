/*
  Warnings:

  - Added the required column `profit_rupiah` to the `pembelians` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pembelians" ADD COLUMN     "profit_rupiah" INTEGER NOT NULL;
