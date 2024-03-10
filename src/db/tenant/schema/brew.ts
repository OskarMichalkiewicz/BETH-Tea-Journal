import { integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { brewing_plan } from "./brewing_plan";

export const brew = sqliteTable("brew", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  brewing_plan_id: integer("brewing_plan_id").references(() => brewing_plan.id),
  time: integer("time"),
});
