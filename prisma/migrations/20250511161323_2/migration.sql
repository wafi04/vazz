/*
  Warnings:

  - You are about to drop the column `status` on the `voucher_usages` table. All the data in the column will be lost.
  - You are about to drop the column `user` on the `voucher_usages` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "voucher_usages_status_idx";

-- DropIndex
DROP INDEX "voucher_usages_user_idx";

-- AlterTable
ALTER TABLE "voucher_usages" DROP COLUMN "status",
DROP COLUMN "user",
ADD COLUMN     "username" TEXT,
ADD COLUMN     "whatsapp" TEXT;

-- CreateIndex
CREATE INDEX "voucher_usages_username_idx" ON "voucher_usages"("username");
