CREATE TABLE IF NOT EXISTS `diary` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` integer NOT NULL,
	`user_id` text NOT NULL,
	`media_id` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `diary_media_id` ON `diary` (`media_id`);--> statement-breakpoint
CREATE INDEX `diary_user_id` ON `diary` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `diary_user_id_media_id_unique` ON `diary` (`user_id`,`media_id`);