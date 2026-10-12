-- "Saxophone" splits into sax alto / ténor / baryton. Members can't be guessed, so
-- they go back to "no instrument" for an admin to reassign; existing sax score links
-- move to sax alto, the most common part, and can be moved by editing the piece.
UPDATE `user` SET `instrument` = NULL WHERE `instrument` = 'saxophone';--> statement-breakpoint
UPDATE `piece_part` SET `instrument` = 'sax_alto' WHERE `instrument` = 'saxophone';
