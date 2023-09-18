ALTER TABLE `transactions` MODIFY COLUMN `currencyCode` varchar(3) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `currencyCode` varchar(3) NOT NULL;