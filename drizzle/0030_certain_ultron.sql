ALTER TABLE `budgetPlans` MODIFY COLUMN `id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `budgetPlans` MODIFY COLUMN `statusId` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `budgetStatuses` MODIFY COLUMN `id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `budgetStatuses` MODIFY COLUMN `profileId` varchar(255) NOT NULL;