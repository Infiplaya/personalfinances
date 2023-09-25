ALTER TABLE `profiles` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `profiles` ADD `id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `currentProfile` varchar(255);--> statement-breakpoint
ALTER TABLE `profiles` ADD PRIMARY KEY(`id`);