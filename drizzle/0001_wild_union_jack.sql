CREATE TABLE `piece` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `piece_part` (
	`id` text PRIMARY KEY NOT NULL,
	`piece_id` text NOT NULL,
	`instrument` text NOT NULL,
	`drive_url` text NOT NULL,
	FOREIGN KEY (`piece_id`) REFERENCES `piece`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `piece_part_piece_instrument_uidx` ON `piece_part` (`piece_id`,`instrument`);
