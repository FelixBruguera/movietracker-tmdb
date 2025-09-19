PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_lists` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`description` text,
	`is_private` integer DEFAULT false,
	`is_watchlist` integer DEFAULT false,
	`created_at` integer DEFAULT (current_timestamp) NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_lists`("id", "name", "description", "is_private", "is_watchlist", "created_at", "user_id") SELECT "id", "name", "description", "is_private", "is_watchlist", "created_at", "user_id" FROM `lists`;--> statement-breakpoint
DROP TABLE `lists`;--> statement-breakpoint
ALTER TABLE `__new_lists` RENAME TO `lists`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `lists_user_id` ON `lists` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `lists_user_id_name_unique` ON `lists` (`user_id`,`name`);