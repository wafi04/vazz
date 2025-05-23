/*
  Warnings:

  - A unique constraint covering the columns `[pembelian_manual_id]` on the table `PembelianManual` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "PembelianManual_pembelian_manual_id_idx";

-- AlterTable
ALTER TABLE "PembelianManual" ADD COLUMN     "sn" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "PembelianManual_pembelian_manual_id_key" ON "PembelianManual"("pembelian_manual_id");
