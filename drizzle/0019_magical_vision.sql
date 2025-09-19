ALTER TABLE `genresToMedia` RENAME TO `genres_media`;--> statement-breakpoint
ALTER TABLE `likesToReviews` RENAME TO `likes_reviews`;--> statement-breakpoint
ALTER TABLE `networksToMedia` RENAME TO `networks_media`;--> statement-breakpoint
ALTER TABLE `peopleToMedia` RENAME TO `people_media`;--> statement-breakpoint
ALTER TABLE `people_media` RENAME COLUMN "isDirector" TO "is_director";--> statement-breakpoint
ALTER TABLE `people_media` RENAME COLUMN "isCreator" TO "is_creator";--> statement-breakpoint
ALTER TABLE `media` RENAME COLUMN "releaseDate" TO "release_date";--> statement-breakpoint
ALTER TABLE `media` RENAME COLUMN "isTv" TO "is_tv";--> statement-breakpoint
CREATE TABLE `list_followers` (
	`list_id` text NOT NULL,
	`user_id` integer NOT NULL,
	FOREIGN KEY (`list_id`) REFERENCES `lists`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `list_followers_list_id` ON `list_followers` (`list_id`);--> statement-breakpoint
CREATE INDEX `list_followers_user_id` ON `list_followers` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `list_followers_list_id_user_id_unique` ON `list_followers` (`list_id`,`user_id`);--> statement-breakpoint
CREATE TABLE `lists` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`description` text,
	`is_private` integer DEFAULT false,
	`is_watchlist` integer DEFAULT false,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `lists_user_id` ON `lists` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `lists_user_id_name_unique` ON `lists` (`user_id`,`name`);--> statement-breakpoint
CREATE TABLE `media_lists` (
	`list_id` text NOT NULL,
	`media_id` integer NOT NULL,
	FOREIGN KEY (`list_id`) REFERENCES `lists`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `media_lists_list_id` ON `media_lists` (`list_id`);--> statement-breakpoint
CREATE INDEX `media_lists_media_id` ON `media_lists` (`media_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `media_lists_list_id_media_id_unique` ON `media_lists` (`list_id`,`media_id`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_genres_media` (
	`genre_id` integer NOT NULL,
	`media_id` integer NOT NULL,
	FOREIGN KEY (`genre_id`) REFERENCES `genres`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_genres_media`("genre_id", "media_id") SELECT "genre_id", "media_id" FROM `genres_media`;--> statement-breakpoint
DROP TABLE `genres_media`;--> statement-breakpoint
ALTER TABLE `__new_genres_media` RENAME TO `genres_media`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `genres_media_media_id` ON `genres_media` (`media_id`);--> statement-breakpoint
CREATE INDEX `genres_media_genre_id` ON `genres_media` (`genre_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `genres_media_genre_id_media_id_unique` ON `genres_media` (`genre_id`,`media_id`);--> statement-breakpoint
CREATE TABLE `__new_likes_reviews` (
	`user_id` text NOT NULL,
	`review_id` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`review_id`) REFERENCES `reviews`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_likes_reviews`("user_id", "review_id") SELECT "user_id", "review_id" FROM `likes_reviews`;--> statement-breakpoint
DROP TABLE `likes_reviews`;--> statement-breakpoint
ALTER TABLE `__new_likes_reviews` RENAME TO `likes_reviews`;--> statement-breakpoint
CREATE INDEX `likes_reviews_review_id` ON `likes_reviews` (`review_id`);--> statement-breakpoint
CREATE INDEX `likes_reviews_user_id` ON `likes_reviews` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `likes_reviews_user_id_review_id_unique` ON `likes_reviews` (`user_id`,`review_id`);--> statement-breakpoint
CREATE TABLE `__new_networks_media` (
	`network_id` integer NOT NULL,
	`media_id` integer NOT NULL,
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
	`media_id` integer NOT NULL,
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
CREATE UNIQUE INDEX `people_media_media_id_person_id_is_director_is_creator_unique` ON `people_media` (`media_id`,`person_id`,`is_director`,`is_creator`);