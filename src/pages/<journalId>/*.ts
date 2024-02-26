import Elysia from "elysia";
import { tea } from "./tea/*";

export const journalId = new Elysia().use(tea);
