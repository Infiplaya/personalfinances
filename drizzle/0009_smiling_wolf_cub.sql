CREATE TABLE `balances` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`totalBalance` double(10,2) DEFAULT 0,
	`userId` varchar(255) NOT NULL,
	CONSTRAINT `balances_id` PRIMARY KEY(`id`),
	CONSTRAINT `userId_idx` UNIQUE(`userId`)
);
