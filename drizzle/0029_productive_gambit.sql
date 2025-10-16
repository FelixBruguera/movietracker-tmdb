PRAGMA foreign_keys=OFF;
PRAGMA defer_foreign_keys = on;--> statement-breakpoint
CREATE TABLE `__new_media` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`poster` text NOT NULL,
	`release_date` integer,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_media`("id", "title", "poster", "release_date", "created_at") SELECT "id", "title", "poster", "release_date", "created_at" FROM `media`;--> statement-breakpoint
DROP TABLE `media`;--> statement-breakpoint
ALTER TABLE `__new_media` RENAME TO `media`;--> statement-breakpoint
CREATE TABLE `__new_diary` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` integer NOT NULL,
	`user_id` text NOT NULL,
	`media_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_diary`("id", "date", "user_id", "media_id") SELECT "id", "date", "user_id", "media_id" FROM `diary`;--> statement-breakpoint
DROP TABLE `diary`;--> statement-breakpoint
ALTER TABLE `__new_diary` RENAME TO `diary`;--> statement-breakpoint
CREATE INDEX `diary_media_id` ON `diary` (`media_id`);--> statement-breakpoint
CREATE INDEX `diary_user_id` ON `diary` (`user_id`);--> statement-breakpoint
CREATE INDEX `diary_yearly_idx` ON `diary` (strftime('%Y', date));--> statement-breakpoint
CREATE INDEX `diary_monthly_idx` ON `diary` (strftime('%Y-%m', date));
CREATE TABLE `__new_genres_media` (
	`genre_id` integer NOT NULL,
	`media_id` text NOT NULL,
	FOREIGN KEY (`genre_id`) REFERENCES `genres`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_genres_media`("genre_id", "media_id") SELECT "genre_id", "media_id" FROM `genres_media`;--> statement-breakpoint
DROP TABLE `genres_media`;--> statement-breakpoint
ALTER TABLE `__new_genres_media` RENAME TO `genres_media`;--> statement-breakpoint
CREATE INDEX `genres_media_media_id` ON `genres_media` (`media_id`);--> statement-breakpoint
CREATE INDEX `genres_media_genre_id` ON `genres_media` (`genre_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `genres_media_genre_id_media_id_unique` ON `genres_media` (`genre_id`,`media_id`);--> statement-breakpoint
CREATE TABLE `__new_media_lists` (
	`list_id` text NOT NULL,
	`media_id` text NOT NULL,
	`created_at` integer DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`list_id`) REFERENCES `lists`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_media_lists`("list_id", "media_id", "created_at") SELECT "list_id", "media_id", "created_at" FROM `media_lists`;--> statement-breakpoint
DROP TABLE `media_lists`;--> statement-breakpoint
ALTER TABLE `__new_media_lists` RENAME TO `media_lists`;--> statement-breakpoint
CREATE INDEX `media_lists_list_id` ON `media_lists` (`list_id`);--> statement-breakpoint
CREATE INDEX `media_lists_media_id` ON `media_lists` (`media_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `media_lists_list_id_media_id_unique` ON `media_lists` (`list_id`,`media_id`);--> statement-breakpoint
CREATE TABLE `__new_networks_media` (
	`network_id` integer NOT NULL,
	`media_id` text NOT NULL,
	FOREIGN KEY (`network_id`) REFERENCES `networks`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_networks_media`("network_id", "media_id") SELECT "network_id", "media_id" FROM `networks_media`;--> statement-breakpoint
DROP TABLE `networks_media`;--> statement-breakpoint
ALTER TABLE `__new_networks_media` RENAME TO `networks_media`;--> statement-breakpoint
CREATE INDEX `networks_media_media_id` ON `networks_media` (`media_id`);--> statement-breakpoint
CREATE INDEX `networks_media_network_id` ON `networks_media` (`network_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `networks_media_network_id_media_id_unique` ON `networks_media` (`network_id`,`media_id`);--> statement-breakpoint
CREATE TABLE `__new_people_media` (
	`person_id` integer NOT NULL,
	`media_id` text NOT NULL,
	`is_director` integer NOT NULL,
	`is_creator` integer NOT NULL,
	FOREIGN KEY (`person_id`) REFERENCES `people`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_people_media`("person_id", "media_id", "is_director", "is_creator") SELECT "person_id", "media_id", "is_director", "is_creator" FROM `people_media`;--> statement-breakpoint
DROP TABLE `people_media`;--> statement-breakpoint
ALTER TABLE `__new_people_media` RENAME TO `people_media`;--> statement-breakpoint
CREATE INDEX `people_media_media_id` ON `people_media` (`media_id`);--> statement-breakpoint
CREATE INDEX `people_media_person_id` ON `people_media` (`person_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `people_media_media_id_person_id_is_director_is_creator_unique` ON `people_media` (`media_id`,`person_id`,`is_director`,`is_creator`);--> statement-breakpoint
CREATE TABLE `__new_reviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`text` text,
	`rating` integer NOT NULL,
	`created_at` integer DEFAULT (current_timestamp) NOT NULL,
	`user_id` text NOT NULL,
	`media_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_reviews`("id", "text", "rating", "created_at", "user_id", "media_id") SELECT "id", "text", "rating", "created_at", "user_id", "media_id" FROM `reviews`;--> statement-breakpoint
DROP TABLE `reviews`;--> statement-breakpoint
ALTER TABLE `__new_reviews` RENAME TO `reviews`;--> statement-breakpoint
CREATE INDEX `reviews_media_id` ON `reviews` (`media_id`);--> statement-breakpoint
CREATE INDEX `reviews_user_id` ON `reviews` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `reviews_user_id_media_id_unique` ON `reviews` (`user_id`,`media_id`);
PRAGMA defer_foreign_keys = off;--> statement-breakpoint
PRAGMA foreign_keys=ON;