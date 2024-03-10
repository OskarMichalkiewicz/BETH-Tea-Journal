import Elysia from "elysia";
import { plans } from "./plans/*";
import { tea } from "./tea/*";

export const journalId = new Elysia().use(tea).use(plans);
