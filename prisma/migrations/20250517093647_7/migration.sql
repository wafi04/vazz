/*
  Warnings:

  - You are about to drop the column `harga_gold` on the `layanans` table. All the data in the column will be lost.
  - You are about to drop the column `profit_gold` on the `layanans` table. All the data in the column will be lost.
  - You are about to drop the column `sub_category_id` on the `layanans` table. All the data in the column will be lost.
  - Added the required column `harga_suggest` to the `layanans` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profit_sugggest` to the `layanans` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "layanans_sub_category_id_status_idx";

-- AlterTable
ALTER TABLE "layanans" DROP COLUMN "harga_gold",
DROP COLUMN "profit_gold",
DROP COLUMN "sub_category_id",
ADD COLUMN     "harga_suggest" INTEGER NOT NULL,
ADD COLUMN     "is_suggest" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "profit_fixed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "profit_sugggest" INTEGER NOT NULL,
ALTER COLUMN "is_flash_sale" SET DEFAULT false;
