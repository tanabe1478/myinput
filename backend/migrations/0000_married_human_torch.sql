CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`auth_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_auth_id_unique` ON `users` (`auth_id`);--> statement-breakpoint
CREATE TABLE `feeds` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`title` text NOT NULL,
	`url` text NOT NULL,
	`created_at` integer NOT NULL,
	`last_fetched_at` integer,
	`fetch_error` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `feeds_user_id_url_unique` ON `feeds` (`user_id`,`url`);--> statement-breakpoint
CREATE TABLE `items` (
	`id` text PRIMARY KEY NOT NULL,
	`feed_id` text NOT NULL,
	`guid` text NOT NULL,
	`title` text NOT NULL,
	`link` text NOT NULL,
	`published_at` integer NOT NULL,
	`summary` text,
	`content` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`feed_id`) REFERENCES `feeds`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `items_feed_id_guid_unique` ON `items` (`feed_id`,`guid`);--> statement-breakpoint
CREATE INDEX `items_feed_id_idx` ON `items` (`feed_id`);--> statement-breakpoint
CREATE INDEX `items_published_at_idx` ON `items` (`published_at`);--> statement-breakpoint
CREATE TABLE `item_states` (
	`id` text PRIMARY KEY NOT NULL,
	`item_id` text NOT NULL,
	`user_id` text NOT NULL,
	`status` text DEFAULT 'unread' NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `item_states_item_id_user_id_unique` ON `item_states` (`item_id`,`user_id`);--> statement-breakpoint
CREATE INDEX `item_states_user_id_idx` ON `item_states` (`user_id`);--> statement-breakpoint
CREATE INDEX `item_states_status_idx` ON `item_states` (`status`);--> statement-breakpoint
CREATE TABLE `themes` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`priority` text DEFAULT 'medium' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `themes_user_id_idx` ON `themes` (`user_id`);--> statement-breakpoint
CREATE TABLE `theme_keywords` (
	`id` text PRIMARY KEY NOT NULL,
	`theme_id` text NOT NULL,
	`keyword` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`theme_id`) REFERENCES `themes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `theme_keywords_theme_id_keyword_unique` ON `theme_keywords` (`theme_id`,`keyword`);--> statement-breakpoint
CREATE INDEX `theme_keywords_theme_id_idx` ON `theme_keywords` (`theme_id`);--> statement-breakpoint
CREATE TABLE `today_snapshots` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`date` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `today_snapshots_user_id_date_unique` ON `today_snapshots` (`user_id`,`date`);--> statement-breakpoint
CREATE INDEX `today_snapshots_user_id_idx` ON `today_snapshots` (`user_id`);--> statement-breakpoint
CREATE INDEX `today_snapshots_date_idx` ON `today_snapshots` (`date`);--> statement-breakpoint
CREATE TABLE `today_snapshot_items` (
	`id` text PRIMARY KEY NOT NULL,
	`snapshot_id` text NOT NULL,
	`item_id` text NOT NULL,
	`bucket` text NOT NULL,
	`rank_in_bucket` integer NOT NULL,
	`score` real NOT NULL,
	`matched_theme_ids` text DEFAULT '[]' NOT NULL,
	FOREIGN KEY (`snapshot_id`) REFERENCES `today_snapshots`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `today_snapshot_items_snapshot_id_item_id_unique` ON `today_snapshot_items` (`snapshot_id`,`item_id`);--> statement-breakpoint
CREATE INDEX `today_snapshot_items_snapshot_id_idx` ON `today_snapshot_items` (`snapshot_id`);