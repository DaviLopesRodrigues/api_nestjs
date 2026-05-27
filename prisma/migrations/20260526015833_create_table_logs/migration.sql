-- CreateTable
CREATE TABLE `tb_logs` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `method` VARCHAR(63) NOT NULL,
    `url` VARCHAR(255) NOT NULL,
    `user_id` INTEGER UNSIGNED NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tb_logs` ADD CONSTRAINT `tb_logs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `tb_users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
