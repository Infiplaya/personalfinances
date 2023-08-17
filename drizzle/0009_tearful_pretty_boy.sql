CREATE TABLE `balances` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`totalBalance` double(10,2) DEFAULT 0,
	`userId` varchar(255) NOT NULL,
	`timestamp` timestamp DEFAULT (now()),
	CONSTRAINT `balances_id` PRIMARY KEY(`id`),
	CONSTRAINT `idId_idx` UNIQUE(`id`)
);
