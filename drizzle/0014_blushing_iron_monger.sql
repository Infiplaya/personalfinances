ALTER TABLE `transactions` RENAME COLUMN `categoryId` TO `categoryName`;--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `categoryName` varchar(255) NOT NULL;