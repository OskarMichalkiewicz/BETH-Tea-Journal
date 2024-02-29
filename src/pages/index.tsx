import { Elysia } from "elysia";
import { BaseHtml } from "../components/base";
import { ctx } from "../context";

export const index = new Elysia()
  .use(ctx)
  .get("/", async ({ set, session, html }) => {
    if (!session) {
      set.redirect = "/login";
      return;
    }
    return html(() => (
      <BaseHtml>
        <div class="flex flex-col items-center py-3">
          <h1 class="text-2xl font-bold text-gray-800" safe>
            Hi! {session.user.name}
          </h1>
          <a
            href="/teas"
            class="-post:ring-2 mt-4 rounded-lg bg-green-500 px-4 py-2 text-gray-100 transition duration-200 hover:bg-green-600 focus:outline-none focus:ring-green-400 focus:ring-opacity-50"
          >
            Open Journal
          </a>
          <a
            href="/api/auth/signout"
            class="-post:ring-2 mt-4 rounded-lg bg-blue-500 px-4 py-2 text-gray-100 transition duration-200 hover:bg-blue-600 focus:outline-none focus:ring-blue-400 focus:ring-opacity-50"
          >
            Sign Out
          </a>
        </div>
      </BaseHtml>
    ));
  });
