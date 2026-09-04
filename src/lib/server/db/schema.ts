import { relations, sql } from 'drizzle-orm';
import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { user } from './auth.schema';

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

export * from './auth.schema';
