/*
  Warnings:

  - You are about to drop the column `user_id` on the `tb_logs` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `tb_logs` DROP FOREIGN KEY `tb_logs_user_id_fkey`;

-- DropIndex
DROP INDEX `tb_logs_user_id_fkey` ON `tb_logs`;

-- AlterTable
ALTER TABLE `tb_logs` DROP COLUMN `user_id`;
