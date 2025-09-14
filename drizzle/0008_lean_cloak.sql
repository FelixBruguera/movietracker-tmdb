PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_reviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`text` text,
	`rating` integer NOT NULL,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`user_id` text NOT NULL,
	`movie_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_reviews`("id", "text", "rating", "created_at", "user_id", "movie_id") SELECT "id", "text", "rating", "created_at", "user_id", "movie_id" FROM `reviews`;--> statement-breakpoint
DROP TABLE `reviews`;--> statement-breakpoint
ALTER TABLE `__new_reviews` RENAME TO `reviews`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `reivews_movie_id` ON `reviews` (`movie_id`);--> statement-breakpoint
CREATE INDEX `reviews_user_id` ON `reviews` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `reviews_user_id_movie_id_unique` ON `reviews` (`user_id`,`movie_id`);