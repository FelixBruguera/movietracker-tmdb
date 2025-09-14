CREATE TABLE `likesToReviews` (
	`user_id` integer NOT NULL,
	`review_id` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`review_id`) REFERENCES `reviews`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `likesToReviews_review_id` ON `likesToReviews` (`review_id`);--> statement-breakpoint
CREATE INDEX `likeToReviews_user_id` ON `likesToReviews` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `likesToReviews_user_id_review_id_unique` ON `likesToReviews` (`user_id`,`review_id`);--> statement-breakpoint
ALTER TABLE `people` ADD `profile_path` text;