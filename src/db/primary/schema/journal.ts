import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { user } from ".";

export const journals = sqliteTable("journal", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  database_name: text("database_name").notNull(),
  database_auth_token: text("database_auth_token").notNull(),
});

export const journalsRelations = relations(journals, ({ many }) => ({
  users: many(user),
}));

export type Journal = typeof journals.$inferSelect;
export type InsertJournal = typeof journals.$inferInsert;

export const insertJournalSchema = createInsertSchema(journals);
export const selectJournalSchema = createSelectSchema(journals);
