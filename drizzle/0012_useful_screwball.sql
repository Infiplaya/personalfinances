ALTER TABLE `categories` ADD `type` enum('expense','income') DEFAULT 'expense' NOT NULL;