import { liveReloadScript } from "beth-stack/dev";
import { Elysia } from "elysia";
import { config } from "../config";
import { ctx } from "../context";

const safeScript =
  config.env.NODE_ENV === "development" ? liveReloadScript() : "";

export const BaseHtml = () => (
  <>
    <script>{safeScript}</script>
    <div hx-get="/index" hx-swap="outerHTML" hx-trigger="load"></div>
  </>
);

export const base = new Elysia()
  .use(ctx)
  .get("/base", async ({ html }) => html(() => <BaseHtml />));
