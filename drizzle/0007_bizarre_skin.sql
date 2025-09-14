CREATE TABLE `genres` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `genresToMovies` (
	`genre_id` integer NOT NULL,
	`movie_id` integer NOT NULL,
	FOREIGN KEY (`genre_id`) REFERENCES `genres`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `genresToMovies_movie_id` ON `genresToMovies` (`movie_id`);--> statement-breakpoint
CREATE INDEX `genresToMovies_genre_id` ON `genresToMovies` (`genre_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `genresToMovies_genre_id_movie_id_unique` ON `genresToMovies` (`genre_id`,`movie_id`);--> statement-breakpoint
CREATE TABLE `movies` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`poster` text NOT NULL,
	`releaseDate` integer,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `people` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `peopleToMovies` (
	`person_id` integer NOT NULL,
	`movie_id` integer NOT NULL,
	`isDirector` integer NOT NULL,
	FOREIGN KEY (`person_id`) REFERENCES `people`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `peopleToMovies_movie_id` ON `peopleToMovies` (`movie_id`);--> statement-breakpoint
CREATE INDEX `peopleToMovies_person_id` ON `peopleToMovies` (`person_id`);--> statement-breakpoint
ALTER TABLE `reviews` ADD `movie_id` text NOT NULL REFERENCES movies(id);--> statement-breakpoint
CREATE INDEX `reivews_movie_id` ON `reviews` (`movie_id`);--> statement-breakpoint
CREATE INDEX `reviews_user_id` ON `reviews` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `reviews_user_id_movie_id_unique` ON `reviews` (`user_id`,`movie_id`);--> statement-breakpoint
CREATE INDEX `searches_user_id` ON `user_search` (`user_id`);