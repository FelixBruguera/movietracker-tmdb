CREATE TABLE `user_search` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`search` text NOT NULL,
	`name` text NOT NULL,
	`created_at` integer NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
