/*
  Warnings:

  - A unique constraint covering the columns `[deposit_id]` on the table `deposits` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "deposits_deposit_id_idx";

-- AlterTable
ALTER TABLE "deposits" ADD COLUMN     "log" TEXT;

-- AlterTable
ALTER TABLE "pembelians" ADD COLUMN     "is_re_order" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Membership" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "benefit" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "deposits_deposit_id_key" ON "deposits"("deposit_id");
