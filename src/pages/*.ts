import Elysia from "elysia";
import { journalId } from "./<journalId>/*";
import { base } from "./base";
import { index } from "./index";
import { teas } from "./teas";

export const pages = new Elysia().use(index).use(base).use(journalId).use(teas);
