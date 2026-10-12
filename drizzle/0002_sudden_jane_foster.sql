DROP INDEX `piece_part_piece_instrument_uidx`;--> statement-breakpoint
ALTER TABLE `piece_part` ADD `part_number` integer DEFAULT 1 NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `piece_part_piece_instrument_part_uidx` ON `piece_part` (`piece_id`,`instrument`,`part_number`);