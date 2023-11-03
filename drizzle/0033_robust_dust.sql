CREATE TABLE `financial_targets` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`amount` double(10,2) NOT NULL,
	`type` enum('goal','limit') NOT NULL,
	`timePeriod` enum('day','month','year') NOT NULL,
	`profileId` varchar(255) NOT NULL,
	CONSTRAINT `financial_targets_id` PRIMARY KEY(`id`)
);
