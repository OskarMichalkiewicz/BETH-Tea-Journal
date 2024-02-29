import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { user } from ".";

export const journal = sqliteTable("journal", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  database_name: text("database_name").notNull(),
  database_auth_token: text("database_auth_token").notNull(),
  public: integer("public", { mode: "boolean" }).notNull().default(false),
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const journalRelations = relations(journal, ({ many }) => ({
  users: many(user),
}));

export type Journal = typeof journal.$inferSelect;
export type InsertJournal = typeof journal.$inferInsert;

export const insertJournalSchema = createInsertSchema(journal);
export const selectJournalSchema = createSelectSchema(journal);
