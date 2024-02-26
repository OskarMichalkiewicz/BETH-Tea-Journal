import Elysia from "elysia";
import { authController } from "./auth";
import { journalsController } from "./journals";
import { TeasController } from "./teas";

export const api = new Elysia({
  prefix: "/api",
})
  .use(authController)
  .use(journalsController)
  .use(TeasController);
