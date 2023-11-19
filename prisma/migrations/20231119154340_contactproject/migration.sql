/*
  Warnings:

  - You are about to drop the `Lead` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `Lead`;

-- CreateTable
CREATE TABLE `Contact` (
    `internal_contact_id` INTEGER NOT NULL AUTO_INCREMENT,
    `external_id` VARCHAR(191) NOT NULL,
    `first_name` VARCHAR(191) NOT NULL,
    `last_name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Contact_internal_contact_id_key`(`internal_contact_id`),
    UNIQUE INDEX `Contact_external_id_key`(`external_id`),
    UNIQUE INDEX `Contact_email_key`(`email`),
    PRIMARY KEY (`internal_contact_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Project` (
    `internal_project_id` INTEGER NOT NULL AUTO_INCREMENT,
    `external_id` VARCHAR(191) NOT NULL,
    `project_name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Project_internal_project_id_key`(`internal_project_id`),
    UNIQUE INDEX `Project_external_id_key`(`external_id`),
    PRIMARY KEY (`internal_project_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContactProject` (
    `contact_id` INTEGER NOT NULL,
    `project_id` INTEGER NOT NULL,

    PRIMARY KEY (`contact_id`, `project_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ContactProject` ADD CONSTRAINT `ContactProject_contact_id_fkey` FOREIGN KEY (`contact_id`) REFERENCES `Contact`(`internal_contact_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContactProject` ADD CONSTRAINT `ContactProject_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `Project`(`internal_project_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
