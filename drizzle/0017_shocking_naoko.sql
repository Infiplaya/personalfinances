CREATE TABLE `profiles` (
	`userId` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`currencyCode` varchar(3) NOT NULL,
	CONSTRAINT `profiles_userId` PRIMARY KEY(`userId`)
);
--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `currencyCode`;