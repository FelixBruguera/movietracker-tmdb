PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_user_search` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`search` text NOT NULL,
	`name` text NOT NULL,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_user_search`("id", "search", "name", "created_at", "user_id") SELECT "id", "search", "name", "created_at", "user_id" FROM `user_search`;--> statement-breakpoint
DROP TABLE `user_search`;--> statement-breakpoint
ALTER TABLE `__new_user_search` RENAME TO `user_search`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `user_search_user_id_name_unique` ON `user_search` (`user_id`,`name`);