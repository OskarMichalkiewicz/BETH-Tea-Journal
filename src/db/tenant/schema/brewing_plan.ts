import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { teas } from ".";

export const brewing_plan = sqliteTable("brewing_plan", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name"),
  tea_id: integer("tea_id", { mode: "number" })
    .references(() => teas.id)
    .notNull(),
});
