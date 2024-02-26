import Elysia from "elysia";
import { id } from "./<id>";
import { newRoute } from "./new";

export const tea = new Elysia().use(id).use(newRoute);
