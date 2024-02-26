import Elysia from "elysia";
import { authGroup } from "./(auth)/*";
import { journalId } from "./<journalId>/*";
import { index } from "./index";
import { newUser } from "./new-user";
import { teas } from "./teas";

export const pages = new Elysia()
  .use(index)
  .use(teas)
  .use(journalId)
  .use(authGroup)
  .use(newUser);
