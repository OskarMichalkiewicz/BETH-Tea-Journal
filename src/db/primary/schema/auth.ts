import { relations } from "drizzle-orm";
import { blob, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { journal } from ".";

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  handle: text("name").notNull(),
  email: text("email"),
  picture: text("picture").notNull(),
  journal_id: integer("journal_id"),
});

export const userRelations = relations(user, ({ one }) => ({
  journal: one(journal, {
    fields: [user.journal_id],
    references: [journal.id],
  }),
}));

export const session = sqliteTable("user_session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  activeExpires: blob("active_expires", {
    mode: "bigint",
  }).notNull(),
  idleExpires: blob("idle_expires", {
    mode: "bigint",
  }).notNull(),
});

export const key = sqliteTable("user_key", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  hashedPassword: text("hashed_password"),
});
