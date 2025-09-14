PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_likesToReviews` (
	`user_id` text NOT NULL,
	`review_id` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`review_id`) REFERENCES `reviews`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_likesToReviews`("user_id", "review_id") SELECT "user_id", "review_id" FROM `likesToReviews`;--> statement-breakpoint
DROP TABLE `likesToReviews`;--> statement-breakpoint
ALTER TABLE `__new_likesToReviews` RENAME TO `likesToReviews`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `likesToReviews_review_id` ON `likesToReviews` (`review_id`);--> statement-breakpoint
CREATE INDEX `likeToReviews_user_id` ON `likesToReviews` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `likesToReviews_user_id_review_id_unique` ON `likesToReviews` (`user_id`,`review_id`);