ALTER TABLE `transactions` MODIFY COLUMN `name` varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE `transactions` ADD `slug` varchar(256) NOT NULL;