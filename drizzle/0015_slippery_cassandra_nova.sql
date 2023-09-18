CREATE TABLE `currencies` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`code` varchar(256) NOT NULL,
	`name` varchar(256) NOT NULL,
	CONSTRAINT `currencies_id` PRIMARY KEY(`id`),
	CONSTRAINT `code_idx` UNIQUE(`code`)
);
--> statement-breakpoint
ALTER TABLE `transactions` ADD `currencyCode` varchar(255) NOT NULL;