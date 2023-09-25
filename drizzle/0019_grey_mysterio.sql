ALTER TABLE `balances` RENAME COLUMN `userId` TO `profileId`;--> statement-breakpoint
ALTER TABLE `transactions` RENAME COLUMN `userId` TO `profileId`;