import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
});

export const credentialsTable = pgTable('credentials_table', {
  id: serial('id').primaryKey(),
  url: text('url').notNull(),
  name: text('name').notNull(),
  username: text('username').notNull(),
  alternative_username: text('alternative_username'),
  password: text('password').notNull(),
  note: text('note'),
  iv: text('iv').notNull(),
  authTag: text('authTag').notNull(),
  userId: integer('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertCredential = typeof credentialsTable.$inferInsert;
export type SelectCredential = typeof credentialsTable.$inferSelect;