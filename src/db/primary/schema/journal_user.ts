import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { journal, user } from ".";

export const journal_user = sqliteTable(
  "journal_user",
  {
    user_id: text("user_id")
      .references(() => user.id)
      .notNull(),
    journal_id: integer("journal_id", { mode: "number" })
      .references(() => journal.id)
      .notNull(),
    admin: integer("admin", { mode: "boolean" }).notNull().default(false),
  },
  (journal_user) => ({
    pk: primaryKey({
      columns: [journal_user.user_id, journal_user.journal_id],
    }),
  }),
);
