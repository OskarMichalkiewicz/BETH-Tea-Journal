import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const teas = sqliteTable("teas", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  kind: text("kind", {
    enum: ["Pu Ehr", "Heicha", "Yellow", "Black", "Green", "Matcha", "White"],
  }).notNull(),
  description: text("description").notNull(),
  created_at: integer("created_at", { mode: "timestamp" }).notNull(),
  updated_at: integer("updated_at", { mode: "timestamp" }).notNull(),
});
