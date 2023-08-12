ALTER TABLE `transactions` MODIFY COLUMN `timestamp` timestamp DEFAULT (now());--> statement-breakpoint
ALTER TABLE `transactions` ADD `categoryId` int NOT NULL;