import { staticPlugin } from "@elysiajs/static";
import { Elysia } from "elysia";
import { config } from "./config";
import { api } from "./controllers/*";
import { pages } from "./pages/*";

const app = new Elysia()
  .use(staticPlugin({ assets: "public", prefix: "" }))
  .use(api)
  .use(pages)
  .onStart(() => {
    if (config.env.NODE_ENV === "development") {
      void fetch("http://localhost:3001/restart");
      console.log("🦊 Triggering Live Reload");
    }
  })
  .onError(({ error }) => {
    console.error(error);
  })
  .listen(3000);

export type App = typeof app;

console.log(
  `app is listening on http://${app.server?.hostname}:${app.server?.port}`,
);
