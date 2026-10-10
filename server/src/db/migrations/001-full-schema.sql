-- Gavran Poultry Management System - Complete Schema

-- Farm table
CREATE TABLE IF NOT EXISTS `Farm` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `code` VARCHAR(191) NOT NULL,
  `ownerId` VARCHAR(191) NOT NULL,
  `address` VARCHAR(191) NULL,
  `city` VARCHAR(191) NULL,
  `state` VARCHAR(191) NULL,
  `country` VARCHAR(191) NULL,
  `postalCode` VARCHAR(191) NULL,
  `active` BOOLEAN NOT NULL DEFAULT true,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  `archivedAt` DATETIME(3) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `Farm_code_key`(`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Shed table
CREATE TABLE IF NOT EXISTS `Shed` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `code` VARCHAR(191) NOT NULL,
  `farmId` VARCHAR(191) NOT NULL,
  `capacity` INTEGER NULL,
  `shedType` VARCHAR(191) NULL,
  `active` BOOLEAN NOT NULL DEFAULT true,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `Shed_code_key`(`code`),
  FOREIGN KEY (`farmId`) REFERENCES `Farm`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- User table
CREATE TABLE IF NOT EXISTS `User` (
  `id` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `passwordHash` VARCHAR(191) NOT NULL,
  `firstName` VARCHAR(191) NOT NULL,
  `lastName` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(191) NULL,
  `active` BOOLEAN NOT NULL DEFAULT true,
  `lastLogin` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `User_email_key`(`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Role table
CREATE TABLE IF NOT EXISTS `Role` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `description` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `Role_name_key`(`name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- UserRole table (many-to-many)
CREATE TABLE IF NOT EXISTS `UserRole` (
  `userId` VARCHAR(191) NOT NULL,
  `roleId` VARCHAR(191) NOT NULL,
  PRIMARY KEY (`userId`, `roleId`),
  FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- FarmMembership table (associates user to farm)
CREATE TABLE IF NOT EXISTS `FarmMembership` (
  `userId` VARCHAR(191) NOT NULL,
  `farmId` VARCHAR(191) NOT NULL,
  `role` VARCHAR(191) NOT NULL DEFAULT 'MEMBER',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`userId`, `farmId`),
  FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`farmId`) REFERENCES `Farm`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- BirdBatch table
CREATE TABLE IF NOT EXISTS `BirdBatch` (
  `id` VARCHAR(191) NOT NULL,
  `farmId` VARCHAR(191) NOT NULL,
  `shedId` VARCHAR(191) NULL,
  `batchCode` VARCHAR(191) NOT NULL,
  `birdType` VARCHAR(191) NULL,
  `source` VARCHAR(191) NULL,
  `hatchDate` DATE NULL,
  `acquisitionDate` DATE NULL,
  `initialQuantity` INTEGER NOT NULL DEFAULT 0,
  `currentQuantity` INTEGER NOT NULL DEFAULT 0,
  `maleQuantity` INTEGER NOT NULL DEFAULT 0,
  `femaleQuantity` INTEGER NOT NULL DEFAULT 0,
  `status` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',
  `notes` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `BirdBatch_batchCode_key`(`batchCode`),
  FOREIGN KEY (`farmId`) REFERENCES `Farm`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`shedId`) REFERENCES `Shed`(`id`) ON DELETE SET NULL
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Bird table
CREATE TABLE IF NOT EXISTS `Bird` (
  `id` VARCHAR(191) NOT NULL,
  `batchId` VARCHAR(191) NOT NULL,
  `farmId` VARCHAR(191) NOT NULL,
  `breed` VARCHAR(191) NOT NULL,
  `sex` VARCHAR(191) NOT NULL,
  `birthDate` DATE NOT NULL,
  `tag` VARCHAR(191) NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',
  `notes` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`batchId`) REFERENCES `BirdBatch`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`farmId`) REFERENCES `Farm`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- BreedingGroup table
CREATE TABLE IF NOT EXISTS `BreedingGroup` (
  `id` VARCHAR(191) NOT NULL,
  `farmId` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `description` TEXT NULL,
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`farmId`) REFERENCES `Farm`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- BreedingGroupMember table (tracks birds in breeding groups)
CREATE TABLE IF NOT EXISTS `BreedingGroupMember` (
  `breedingGroupId` VARCHAR(191) NOT NULL,
  `birdId` VARCHAR(191) NOT NULL,
  `assignedDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`breedingGroupId`, `birdId`),
  FOREIGN KEY (`breedingGroupId`) REFERENCES `BreedingGroup`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`birdId`) REFERENCES `Bird`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Egg table
CREATE TABLE IF NOT EXISTS `Egg` (
  `id` VARCHAR(191) NOT NULL,
  `farmId` VARCHAR(191) NOT NULL,
  `batchId` VARCHAR(191) NULL,
  `dateCollected` DATE NOT NULL,
  `quantity` INTEGER NOT NULL DEFAULT 0,
  `quality` VARCHAR(191) NOT NULL DEFAULT 'NORMAL',
  `isFertilized` BOOLEAN NOT NULL DEFAULT false,
  `storageLocation` VARCHAR(191) NULL,
  `notes` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`farmId`) REFERENCES `Farm`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`batchId`) REFERENCES `BirdBatch`(`id`) ON DELETE SET NULL
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Incubator table
CREATE TABLE IF NOT EXISTS `Incubator` (
  `id` VARCHAR(191) NOT NULL,
  `farmId` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `code` VARCHAR(191) NOT NULL,
  `capacity` INTEGER NOT NULL DEFAULT 0,
  `location` VARCHAR(191) NULL,
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `Incubator_code_key`(`code`),
  FOREIGN KEY (`farmId`) REFERENCES `Farm`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- IncubationBatch table
CREATE TABLE IF NOT EXISTS `IncubationBatch` (
  `id` VARCHAR(191) NOT NULL,
  `farmId` VARCHAR(191) NOT NULL,
  `incubatorId` VARCHAR(191) NULL,
  `eggBatchId` VARCHAR(191) NULL,
  `hatchDate` DATE NOT NULL,
  `initialEggCount` INTEGER NOT NULL DEFAULT 0,
  `expectedHatchCount` INTEGER NOT NULL DEFAULT 0,
  `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
  `notes` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`farmId`) REFERENCES `Farm`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`incubatorId`) REFERENCES `Incubator`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`eggBatchId`) REFERENCES `Egg`(`id`) ON DELETE SET NULL
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CandlingEvent table
CREATE TABLE IF NOT EXISTS `CandlingEvent` (
  `id` VARCHAR(191) NOT NULL,
  `incubationBatchId` VARCHAR(191) NOT NULL,
  `candlingDate` DATE NOT NULL,
  `fertileEggsCount` INTEGER NOT NULL DEFAULT 0,
  `deadEggsCount` INTEGER NOT NULL DEFAULT 0,
  `hatchedEggsCount` INTEGER NOT NULL DEFAULT 0,
  `notes` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`incubationBatchId`) REFERENCES `IncubationBatch`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- HatchEvent table
CREATE TABLE IF NOT EXISTS `HatchEvent` (
  `id` VARCHAR(191) NOT NULL,
  `incubationBatchId` VARCHAR(191) NOT NULL,
  `hatchDate` DATE NOT NULL,
  `hatchedCount` INTEGER NOT NULL DEFAULT 0,
  `deceasedCount` INTEGER NOT NULL DEFAULT 0,
  `notes` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`incubationBatchId`) REFERENCES `IncubationBatch`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- HealthRecord table
CREATE TABLE IF NOT EXISTS `HealthRecord` (
  `id` VARCHAR(191) NOT NULL,
  `farmId` VARCHAR(191) NOT NULL,
  `birdId` VARCHAR(191) NULL,
  `batchId` VARCHAR(191) NULL,
  `recordDate` DATETIME NOT NULL,
  `type` VARCHAR(191) NOT NULL,
  `description` TEXT NOT NULL,
  `treatment` TEXT NULL,
  `doctor` VARCHAR(191) NULL,
  `notes` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`farmId`) REFERENCES `Farm`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`birdId`) REFERENCES `Bird`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`batchId`) REFERENCES `BirdBatch`(`id`) ON DELETE SET NULL
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- VeterinarySOP table
CREATE TABLE IF NOT EXISTS `VeterinarySOP` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `description` TEXT NULL,
  `category` VARCHAR(191) NOT NULL DEFAULT 'GENERAL',
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- VaccinationPlan table
CREATE TABLE IF NOT EXISTS `VaccinationPlan` (
  `id` VARCHAR(191) NOT NULL,
  `farmId` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `description` TEXT NULL,
  `vaccineName` VARCHAR(191) NOT NULL,
  `ageInDays` INTEGER NOT NULL DEFAULT 0,
  `dosage` VARCHAR(191) NULL,
  `frequency` VARCHAR(191) NOT NULL DEFAULT 'ONCE',
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`farmId`) REFERENCES `Farm`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- VaccinationRecord table
CREATE TABLE IF NOT EXISTS `VaccinationRecord` (
  `id` VARCHAR(191) NOT NULL,
  `farmId` VARCHAR(191) NOT NULL,
  `birdId` VARCHAR(191) NULL,
  `batchId` VARCHAR(191) NULL,
  `vaccinationPlanId` VARCHAR(191) NULL,
  `vaccineName` VARCHAR(191) NOT NULL,
  `dateGiven` DATE NOT NULL,
  `dose` VARCHAR(191) NULL,
  `administeredByName` VARCHAR(191) NULL,
  `notes` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`farmId`) REFERENCES `Farm`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`birdId`) REFERENCES `Bird`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`batchId`) REFERENCES `BirdBatch`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`vaccinationPlanId`) REFERENCES `VaccinationPlan`(`id`) ON DELETE SET NULL
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Medicine table
CREATE TABLE IF NOT EXISTS `Medicine` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `description` TEXT NULL,
  `type` VARCHAR(191) NOT NULL DEFAULT 'MEDICATION',
  `dosageForm` VARCHAR(191) NOT NULL DEFAULT 'POWDER',
  `active` BOOLEAN NOT NULL DEFAULT true,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- MedicineRecord table
CREATE TABLE IF NOT EXISTS `MedicineRecord` (
  `id` VARCHAR(191) NOT NULL,
  `farmId` VARCHAR(191) NOT NULL,
  `birdId` VARCHAR(191) NULL,
  `batchId` VARCHAR(191) NULL,
  `medicineId` VARCHAR(191) NOT NULL,
  `dateGiven` DATE NOT NULL,
  `dosage` VARCHAR(191) NOT NULL,
  `frequency` VARCHAR(191) NOT NULL DEFAULT 'ONCE',
  `administeredByName` VARCHAR(191) NULL,
  `notes` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`farmId`) REFERENCES `Farm`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`birdId`) REFERENCES `Bird`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`batchId`) REFERENCES `BirdBatch`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`medicineId`) REFERENCES `Medicine`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- MortalityRecord table
CREATE TABLE IF NOT EXISTS `MortalityRecord` (
  `id` VARCHAR(191) NOT NULL,
  `farmId` VARCHAR(191) NOT NULL,
  `batchId` VARCHAR(191) NOT NULL,
  `deathDate` DATE NOT NULL,
  `quantity` INTEGER NOT NULL DEFAULT 1,
  `causeOfDeath` VARCHAR(191) NULL,
  `notes` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`farmId`) REFERENCES `Farm`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`batchId`) REFERENCES `BirdBatch`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- FeedType table
CREATE TABLE IF NOT EXISTS `FeedType` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `description` TEXT NULL,
  `species` VARCHAR(191) NOT NULL DEFAULT 'BIRD',
  `nutritionalInfo` JSON NULL,
  `active` BOOLEAN NOT NULL DEFAULT true,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- FeedInventory table
CREATE TABLE IF NOT EXISTS `FeedInventory` (
  `id` VARCHAR(191) NOT NULL,
  `farmId` VARCHAR(191) NOT NULL,
  `feedTypeId` VARCHAR(191) NOT NULL,
  `quantity` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `unit` VARCHAR(191) NOT NULL DEFAULT 'KG',
  `supplier` VARCHAR(191) NULL,
  `purchaseDate` DATE NOT NULL,
  `expiryDate` DATE NULL,
  `batchNumber` VARCHAR(191) NULL,
  `notes` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`farmId`) REFERENCES `Farm`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`feedTypeId`) REFERENCES `FeedType`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- FeedConsumption table
CREATE TABLE IF NOT EXISTS `FeedConsumption` (
  `id` VARCHAR(191) NOT NULL,
  `farmId` VARCHAR(191) NOT NULL,
  `batchId` VARCHAR(191) NOT NULL,
  `feedTypeId` VARCHAR(191) NOT NULL,
  `quantityConsumed` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `consumptionDate` DATE NOT NULL,
  `shedId` VARCHAR(191) NULL,
  `notes` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`farmId`) REFERENCES `Farm`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`batchId`) REFERENCES `BirdBatch`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`feedTypeId`) REFERENCES `FeedType`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`shedId`) REFERENCES `Shed`(`id`) ON DELETE SET NULL
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- EnvironmentObservation table
CREATE TABLE IF NOT EXISTS `EnvironmentObservation` (
  `id` VARCHAR(191) NOT NULL,
  `farmId` VARCHAR(191) NOT NULL,
  `shedId` VARCHAR(191) NOT NULL,
  `observationDate` DATETIME NOT NULL,
  `temperature` DECIMAL(5,2) NOT NULL,
  `humidity` DECIMAL(5,2) NOT NULL,
  `lightIntensity` DECIMAL(5,2) NULL,
  `airQuality` VARCHAR(191) NOT NULL DEFAULT 'NORMAL',
  `notes` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`farmId`) REFERENCES `Farm`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`shedId`) REFERENCES `Shed`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- BiosecurityRecord table
CREATE TABLE IF NOT EXISTS `BiosecurityRecord` (
  `id` VARCHAR(191) NOT NULL,
  `farmId` VARCHAR(191) NOT NULL,
  `recordDate` DATE NOT NULL,
  `activity` VARCHAR(191) NOT NULL,
  `description` TEXT NOT NULL,
  `personResponsible` VARCHAR(191) NOT NULL,
  `notes` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`farmId`) REFERENCES `Farm`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- BiosecurityChecklist table
CREATE TABLE IF NOT EXISTS `BiosecurityChecklist` (
  `id` VARCHAR(191) NOT NULL,
  `farmId` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `description` TEXT NULL,
  `category` VARCHAR(191) NOT NULL DEFAULT 'GENERAL',
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`farmId`) REFERENCES `Farm`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Worker table
CREATE TABLE IF NOT EXISTS `Worker` (
  `id` VARCHAR(191) NOT NULL,
  `farmId` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `firstName` VARCHAR(191) NOT NULL,
  `lastName` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(191) NULL,
  `position` VARCHAR(191) NOT NULL DEFAULT 'STAFF',
  `startDate` DATE NOT NULL,
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `notes` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`farmId`) REFERENCES `Farm`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- WorkerAssignment table (for assigning tasks to workers)
CREATE TABLE IF NOT EXISTS `WorkerAssignment` (
  `workerId` VARCHAR(191) NOT NULL,
  `taskId` VARCHAR(191) NOT NULL,
  `assignedDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`workerId`, `taskId`),
  FOREIGN KEY (`workerId`) REFERENCES `Worker`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`taskId`) REFERENCES `Task`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- WorkerDocument table
CREATE TABLE IF NOT EXISTS `WorkerDocument` (
  `id` VARCHAR(191) NOT NULL,
  `workerId` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `description` TEXT NULL,
  `documentType` VARCHAR(191) NOT NULL DEFAULT 'CERTIFICATE',
  `fileUrl` VARCHAR(191) NULL,
  `expiryDate` DATE NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`workerId`) REFERENCES `Worker`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Task table
CREATE TABLE IF NOT EXISTS `Task` (
  `id` VARCHAR(191) NOT NULL,
  `farmId` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `description` TEXT NULL,
  `type` VARCHAR(191) NOT NULL DEFAULT 'GENERAL',
  `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
  `priority` VARCHAR(191) NOT NULL DEFAULT 'MEDIUM',
  `dueDate` DATETIME NULL,
  `assignedTo` VARCHAR(191) NULL,
  `completedBy` VARCHAR(191) NULL,
  `completionDate` DATETIME NULL,
  `notes` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`farmId`) REFERENCES `Farm`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Customer table
CREATE TABLE IF NOT EXISTS `Customer` (
  `id` VARCHAR(191) NOT NULL,
  `farmId` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NULL,
  `phone` VARCHAR(191) NULL,
  `address` VARCHAR(191) NULL,
  `city` VARCHAR(191) NULL,
  `state` VARCHAR(191) NULL,
  `country` VARCHAR(191) NULL,
  `notes` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`farmId`) REFERENCES `Farm`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Supplier table
CREATE TABLE IF NOT EXISTS `Supplier` (
  `id` VARCHAR(191) NOT NULL,
  `farmId` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NULL,
  `phone` VARCHAR(191) NULL,
  `address` VARCHAR(191) NULL,
  `city` VARCHAR(191) NULL,
  `state` VARCHAR(191) NULL,
  `country` VARCHAR(191) NULL,
  `notes` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`farmId`) REFERENCES `Farm`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Sale table
CREATE TABLE IF NOT EXISTS `Sale` (
  `id` VARCHAR(191) NOT NULL,
  `farmId` VARCHAR(191) NOT NULL,
  `customerId` VARCHAR(191) NOT NULL,
  `saleDate` DATE NOT NULL,
  `totalAmount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `currency` VARCHAR(3) NOT NULL DEFAULT 'USD',
  `status` VARCHAR(191) NOT NULL DEFAULT 'COMPLETED',
  `notes` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`farmId`) REFERENCES `Farm`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- PurchaseOrder table  
CREATE TABLE IF NOT EXISTS `PurchaseOrder` (
  `id` VARCHAR(191) NOT NULL,
  `farmId` VARCHAR(191) NOT NULL,
  `supplierId` VARCHAR(191) NOT NULL,
  `orderDate` DATE NOT NULL,
  `expectedDeliveryDate` DATE NULL,
  `totalAmount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `currency` VARCHAR(3) NOT NULL DEFAULT 'USD',
  `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
  `notes` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`farmId`) REFERENCES `Farm`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`supplierId`) REFERENCES `Supplier`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- FinancialAccount table
CREATE TABLE IF NOT EXISTS `FinancialAccount` (
  `id` VARCHAR(191) NOT NULL,
  `farmId` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `accountType` VARCHAR(191) NOT NULL DEFAULT 'BANK',
  `balance` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `currency` VARCHAR(3) NOT NULL DEFAULT 'USD',
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `notes` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`farmId`) REFERENCES `Farm`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- FinancialRecord table
CREATE TABLE IF NOT EXISTS `FinancialRecord` (
  `id` VARCHAR(191) NOT NULL,
  `farmId` VARCHAR(191) NOT NULL,
  `accountId` VARCHAR(191) NOT NULL,
  `recordDate` DATE NOT NULL,
  `type` VARCHAR(191) NOT NULL DEFAULT 'INCOME',
  `amount` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `currency` VARCHAR(3) NOT NULL DEFAULT 'USD',
  `description` TEXT NOT NULL,
  `category` VARCHAR(191) NULL,
  `relatedRecordId` VARCHAR(191) NULL,
  `notes` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`farmId`) REFERENCES `Farm`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`accountId`) REFERENCES `FinancialAccount`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Payment table
CREATE TABLE IF NOT EXISTS `Payment` (
  `id` VARCHAR(191) NOT NULL,
  `farmId` VARCHAR(191) NOT NULL,
  `accountId` VARCHAR(191) NOT NULL,
  `paymentDate` DATE NOT NULL,
  `amount` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `currency` VARCHAR(3) NOT NULL DEFAULT 'USD',
  `type` VARCHAR(191) NOT NULL DEFAULT 'CASH',
  `status` VARCHAR(191) NOT NULL DEFAULT 'COMPLETED',
  `description` TEXT NOT NULL,
  `notes` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`farmId`) REFERENCES `Farm`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`accountId`) REFERENCES `FinancialAccount`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Alert table
CREATE TABLE IF NOT EXISTS `Alert` (
  `id` VARCHAR(191) NOT NULL,
  `farmId` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `description` TEXT NOT NULL,
  `type` VARCHAR(191) NOT NULL DEFAULT 'INFO',
  `priority` VARCHAR(191) NOT NULL DEFAULT 'MEDIUM',
  `status` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`farmId`) REFERENCES `Farm`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AuditLog table
CREATE TABLE IF NOT EXISTS `AuditLog` (
  `id` VARCHAR(191) NOT NULL,
  `farmId` VARCHAR(191) NULL,
  `userId` VARCHAR(191) NULL,
  `action` VARCHAR(191) NOT NULL,
  `table` VARCHAR(191) NULL,
  `recordId` VARCHAR(191) NULL,
  `beforeData` JSON NULL,
  `afterData` JSON NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`farmId`) REFERENCES `Farm`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- QRCode table
CREATE TABLE IF NOT EXISTS `QRCode` (
  `id` VARCHAR(191) NOT NULL,
  `farmId` VARCHAR(191) NOT NULL,
  `code` VARCHAR(191) NOT NULL,
  `type` VARCHAR(191) NOT NULL DEFAULT 'BATCH',
  `referenceId` VARCHAR(191) NOT NULL,
  `description` TEXT NULL,
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `QRCode_code_key`(`code`),
  FOREIGN KEY (`farmId`) REFERENCES `Farm`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;