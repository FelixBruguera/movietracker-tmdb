CREATE INDEX `diary_yearly_idx` ON `diary` (strftime('%Y', date));--> statement-breakpoint
CREATE INDEX `diary_monthly_idx` ON `diary` (strftime('%Y-%m', date));