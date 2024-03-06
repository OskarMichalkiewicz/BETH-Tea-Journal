import Elysia from "elysia";
import { journalId } from "./<journalId>/*";
import { dashboard } from "./dashboard";
import { index } from "./index";
import { login } from "./login";
import { newUser } from "./new-user";
import { teas } from "./teas";

export const pages = new Elysia()
  .use(index)
  .use(login)
  .use(newUser)
  .use(dashboard)
  .use(journalId)
  .use(teas);
