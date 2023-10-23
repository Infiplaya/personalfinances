CREATE TABLE `budgetPlans` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`statusId` varchar(255) NOT NULL,
	CONSTRAINT `budgetPlans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `budgetStatuses` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`profileId` varchar(255) NOT NULL,
	CONSTRAINT `budgetStatuses_id` PRIMARY KEY(`id`),
	CONSTRAINT `profileIdName_idx` UNIQUE(`name`,`profileId`)
);
