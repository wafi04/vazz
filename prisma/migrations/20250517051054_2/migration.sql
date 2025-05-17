/*
  Warnings:

  - You are about to drop the `ovos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ovos";

-- CreateTable
CREATE TABLE "PembelianManual" (
    "id" SERIAL NOT NULL,
    "order_id" TEXT NOT NULL,
    "pembelian_manual_id" TEXT NOT NULL,
    "created_by" TEXT,
    "reason" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PembelianManual_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PembelianManual_order_id_idx" ON "PembelianManual"("order_id");

-- CreateIndex
CREATE INDEX "PembelianManual_pembelian_manual_id_idx" ON "PembelianManual"("pembelian_manual_id");

-- CreateIndex
CREATE INDEX "PembelianManual_status_idx" ON "PembelianManual"("status");
