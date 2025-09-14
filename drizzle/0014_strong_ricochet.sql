PRAGMA defer_foreign_keys = on;
ALTER TABLE `genresToMovies` RENAME TO `genresToMedia`;--> statement-breakpoint
ALTER TABLE `movies` RENAME TO `media`;--> statement-breakpoint
ALTER TABLE `peopleToMovies` RENAME TO `peopleToMedia`;--> statement-breakpoint
ALTER TABLE `genresToMedia` RENAME COLUMN "movie_id" TO "media_id";--> statement-breakpoint
ALTER TABLE `peopleToMedia` RENAME COLUMN "movie_id" TO "media_id";--> statement-breakpoint
CREATE TABLE `networks` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `networksToMedia` (
	`network_id` integer NOT NULL,
	`media_id` integer NOT NULL,
	FOREIGN KEY (`network_id`) REFERENCES `networks`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `networksToMedia_media_id` ON `networksToMedia` (`media_id`);--> statement-breakpoint
CREATE INDEX `networksToMedia_network_id` ON `networksToMedia` (`network_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `networksToMedia_network_id_media_id_unique` ON `networksToMedia` (`network_id`,`media_id`);--> statement-breakpoint
CREATE TABLE `__new_genresToMedia` (
	`genre_id` integer NOT NULL,
	`media_id` integer NOT NULL,
	FOREIGN KEY (`genre_id`) REFERENCES `genres`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_genresToMedia`("genre_id", "media_id") SELECT "genre_id", "media_id" FROM `genresToMedia`;--> statement-breakpoint
DROP TABLE `genresToMedia`;--> statement-breakpoint
ALTER TABLE `__new_genresToMedia` RENAME TO `genresToMedia`;--> statement-breakpoint
CREATE INDEX `genresToMedia_media_id` ON `genresToMedia` (`media_id`);--> statement-breakpoint
CREATE INDEX `genresToMedia_genre_id` ON `genresToMedia` (`genre_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `genresToMedia_genre_id_media_id_unique` ON `genresToMedia` (`genre_id`,`media_id`);--> statement-breakpoint
ALTER TABLE `media` ADD `isTv` integer;--> statement-breakpoint
CREATE TABLE `__new_peopleToMedia` (
	`person_id` integer NOT NULL,
	`media_id` integer NOT NULL,
	`isDirector` integer NOT NULL,
	`isCreator` integer NOT NULL,
	FOREIGN KEY (`person_id`) REFERENCES `people`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_peopleToMedia`("person_id", "media_id", "isDirector", "isCreator") SELECT "person_id", "media_id", "isDirector", "isCreator" FROM `peopleToMedia`;--> statement-breakpoint
DROP TABLE `peopleToMedia`;--> statement-breakpoint
ALTER TABLE `__new_peopleToMedia` RENAME TO `peopleToMedia`;--> statement-breakpoint
CREATE INDEX `peopleToMedia_media_id` ON `peopleToMedia` (`media_id`);--> statement-breakpoint
CREATE INDEX `peopleToMedia_person_id` ON `peopleToMedia` (`person_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `peopleToMedia_media_id_person_id_isDirector_isCreator_unique` ON `peopleToMedia` (`media_id`,`person_id`,`isDirector`,`isCreator`);--> statement-breakpoint
CREATE TABLE `__new_reviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`text` text,
	`rating` integer NOT NULL,
	`created_at` integer DEFAULT (current_timestamp) NOT NULL,
	`user_id` text NOT NULL,
	`media_id` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_reviews`("id", "text", "rating", "created_at", "user_id", "media_id") SELECT "id", "text", "rating", "created_at", "user_id", "movie_id" FROM `reviews`;--> statement-breakpoint
DROP TABLE `reviews`;--> statement-breakpoint
ALTER TABLE `__new_reviews` RENAME TO `reviews`;--> statement-breakpoint
CREATE INDEX `reviews_media_id` ON `reviews` (`media_id`);--> statement-breakpoint
CREATE INDEX `reviews_user_id` ON `reviews` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `reviews_user_id_media_id_unique` ON `reviews` (`user_id`,`media_id`);
PRAGMA defer_foreign_keys = off;