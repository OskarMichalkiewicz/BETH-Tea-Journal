import { liveReloadScript } from "beth-stack/dev";
import { Elysia } from "elysia";
import { config } from "../config";
import { ctx } from "../context";

const safeScript =
  config.env.NODE_ENV === "development" ? liveReloadScript() : "";

export const index = new Elysia()
  .use(ctx)
  .get("/", async ({ session, html }) => {
    let path: GetRoutes = "/";
    if (session) {
      if (session.user.journal_id) {
        path = "/dashboard";
      } else {
        path = "/new-user";
      }
    } else path = "/login";

    return html(() => (
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>THE BETH STACK</title>
          <script src="https://unpkg.com/htmx.org@1.9.5"></script>
          <script src="https://unpkg.com/htmx.org/dist/ext/response-targets.js"></script>
          <script src="https://unpkg.com/htmx.org/dist/ext/loading-states.js"></script>
          <script src="https://unpkg.com/hyperscript.org@0.9.11"></script>
          <script>{safeScript}</script>
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/@unocss/reset/tailwind.min.css"
          />
          <link rel="stylesheet" href="dist/unocss.css" />
          <style>
            {` 
              [data-loading] {
                display: none;
              }
            `}
          </style>
        </head>

        <body
          class="overflow-auto bg-slate-900"
          hx-boost="true"
          hx-ext="loading-states"
        >
          <div id="main" hx-get={path} hx-swap="outerHTML" hx-trigger="load" />
        </body>
      </html>
    ));
  });
