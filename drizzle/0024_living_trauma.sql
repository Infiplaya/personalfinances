ALTER TABLE `transactions` MODIFY COLUMN `amount` decimal(10,2) NOT NULL;--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `baseAmount` decimal(10,2) NOT NULL;