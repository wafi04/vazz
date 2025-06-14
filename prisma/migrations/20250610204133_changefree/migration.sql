/*
  Warnings:

  - You are about to drop the column `fee` on the `deposits` table. All the data in the column will be lost.
  - You are about to drop the column `fee_rupiah` on the `deposits` table. All the data in the column will be lost.
  - Added the required column `total_amount` to the `pembayarans` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "deposits" DROP COLUMN "fee",
DROP COLUMN "fee_rupiah";

-- AlterTable
ALTER TABLE "pembayarans" ADD COLUMN     "fee" INTEGER,
ADD COLUMN     "fee_rupiah" INTEGER,
ADD COLUMN     "total_amount" INTEGER NOT NULL;
