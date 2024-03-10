import Elysia from "elysia";
import { add } from "./add";
import { brewingPlans } from "./brewing-plans";

export const teaId = new Elysia().use(brewingPlans).use(add);
