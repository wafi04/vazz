-- CreateTable
CREATE TABLE `voucher_usages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `voucher_id` INTEGER NOT NULL,
    `order_id` INTEGER NOT NULL,
    `user` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `expires_at` DATETIME(3) NULL,

    INDEX `voucher_usages_voucher_id_idx`(`voucher_id`),
    INDEX `voucher_usages_order_id_idx`(`order_id`),
    INDEX `voucher_usages_user_idx`(`user`),
    INDEX `voucher_usages_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
