-- "Tuba" is renamed "Basse" (the section's name in the band). Same members, same
-- score links: only the stored value changes.
UPDATE `user` SET `instrument` = 'basse' WHERE `instrument` = 'tuba';--> statement-breakpoint
UPDATE `piece_part` SET `instrument` = 'basse' WHERE `instrument` = 'tuba';
