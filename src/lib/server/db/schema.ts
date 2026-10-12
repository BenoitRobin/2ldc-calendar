import { relations, sql } from 'drizzle-orm';
import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { user } from './auth.schema';
// Relative path (not $lib): drizzle-kit loads this file outside Vite's alias resolution.
import { INSTRUMENTS } from '../../instruments';

export const event = sqliteTable('event', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name').notNull(),
	date: text('date').notNull(),
	startTime: text('start_time'),
	endTime: text('end_time'),
	location: text('location'),
	description: text('description'),
	createdBy: text('created_by')
		.notNull()
		.references(() => user.id),
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.$onUpdate(() => new Date())
		.notNull()
});

export const attendanceResponse = sqliteTable(
	'attendance_response',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		eventId: text('event_id')
			.notNull()
			.references(() => event.id, { onDelete: 'cascade' }),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		// Four-state model (specs/event-attendance): "no response yet" is the absence
		// of a row, never a fourth enum value, so it can't be overwritten by accident.
		status: text('status', { enum: ['oui', 'non', 'indecis'] }).notNull(),
		createdAt: integer('created_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull(),
		updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.$onUpdate(() => new Date())
			.notNull()
	},
	(table) => [uniqueIndex('attendance_response_event_user_uidx').on(table.eventId, table.userId)]
);

export const eventRelations = relations(event, ({ many, one }) => ({
	responses: many(attendanceResponse),
	createdByUser: one(user, { fields: [event.createdBy], references: [user.id] })
}));

export const attendanceResponseRelations = relations(attendanceResponse, ({ one }) => ({
	event: one(event, { fields: [attendanceResponse.eventId], references: [event.id] }),
	user: one(user, { fields: [attendanceResponse.userId], references: [user.id] })
}));

// Sheet music library (Partition page). Files stay on Google Drive: a part is just
// the Drive link for one instrument, so the app never stores or serves PDFs itself.
export const piece = sqliteTable('piece', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	title: text('title').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.$onUpdate(() => new Date())
		.notNull()
});

export const piecePart = sqliteTable(
	'piece_part',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		pieceId: text('piece_id')
			.notNull()
			.references(() => piece.id, { onDelete: 'cascade' }),
		instrument: text('instrument', { enum: INSTRUMENTS }).notNull(),
		// 1-based: trombone, trompette and sax often have a partie 1 and a partie 2.
		// An instrument with a single part just has part 1.
		partNumber: integer('part_number').notNull().default(1),
		driveUrl: text('drive_url').notNull()
	},
	(table) => [
		uniqueIndex('piece_part_piece_instrument_part_uidx').on(
			table.pieceId,
			table.instrument,
			table.partNumber
		)
	]
);

export const pieceRelations = relations(piece, ({ many }) => ({
	parts: many(piecePart)
}));

export const piecePartRelations = relations(piecePart, ({ one }) => ({
	piece: one(piece, { fields: [piecePart.pieceId], references: [piece.id] })
}));

export * from './auth.schema';
