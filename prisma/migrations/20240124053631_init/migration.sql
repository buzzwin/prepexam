-- CreateTable
CREATE TABLE `userAPILimit` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `count` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `stripe_customer_id` VARCHAR(191) NULL,
    `stripe_subscription_id` VARCHAR(191) NULL,
    `stripe_price_id` VARCHAR(191) NULL,
    `stripe_current_period_end` DATETIME(3) NULL,
    `subscriptionType` ENUM('FREE', 'FLEXIBLE', 'PREMIUM') NOT NULL DEFAULT 'FREE',
    `currentSubscriptionPeriodEnd` DATETIME(3) NULL,
    `characterCount` INTEGER NULL,

    UNIQUE INDEX `userAPILimit_userId_key`(`userId`),
    UNIQUE INDEX `userAPILimit_stripe_customer_id_key`(`stripe_customer_id`),
    UNIQUE INDEX `userAPILimit_stripe_subscription_id_key`(`stripe_subscription_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `File` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `uploadStatus` ENUM('PENDING', 'PROCESSING', 'FAILED', 'SUCCESS') NOT NULL DEFAULT 'PENDING',
    `url` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Message` (
    `id` VARCHAR(191) NOT NULL,
    `text` TEXT NOT NULL,
    `isUserMessage` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `fileId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GeneratedVoices` (
    `id` VARCHAR(191) NOT NULL,
    `characterCountChangeFrom` INTEGER NOT NULL,
    `characterCountChangeTo` INTEGER NOT NULL,
    `contentType` VARCHAR(191) NOT NULL,
    `dateUnix` INTEGER NOT NULL,
    `feedback` JSON NULL,
    `historyItemId` VARCHAR(191) NOT NULL,
    `modelId` VARCHAR(191) NOT NULL,
    `requestId` VARCHAR(191) NOT NULL,
    `settings` JSON NULL,
    `shareLinkId` VARCHAR(191) NULL,
    `state` ENUM('created', 'deleted', 'processing') NOT NULL,
    `text` VARCHAR(191) NOT NULL,
    `voiceCategory` VARCHAR(191) NOT NULL,
    `voiceId` VARCHAR(191) NOT NULL,
    `voiceName` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `isPaid` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transactions` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `amountPaid` DECIMAL(65, 30) NOT NULL,
    `productName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
