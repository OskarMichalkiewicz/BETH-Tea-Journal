import Elysia from "elysia";
import { authController } from "./auth";
import { BrewingPlansController } from "./brewing_plans";
import { BrewsController } from "./brews";
import { journalsController } from "./journals";
import { TeasController } from "./teas";

export const api = new Elysia({
  prefix: "/api",
})
  .use(authController)
  .use(journalsController)
  .use(BrewingPlansController)
  .use(BrewsController)
  .use(TeasController);
