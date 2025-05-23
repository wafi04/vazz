/*
  Warnings:

  - Added the required column `product_name` to the `PembelianManual` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `PembelianManual` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PembelianManual" ADD COLUMN     "nickname" TEXT,
ADD COLUMN     "product_name" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL,
ADD COLUMN     "zone" TEXT;
