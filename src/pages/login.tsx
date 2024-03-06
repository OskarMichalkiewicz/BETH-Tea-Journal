import { Elysia } from "elysia";
import { ctx } from "../context";

export const login = new Elysia().use(ctx).get("/login", async ({ html }) => {
  return html(() => (
    <div
      class="flex h-screen w-full flex-col items-center justify-center"
      hx-ext="response-targets"
    >
      <div class="p-4">
        <a
          href="/"
          class="text-indigo-600 hover:text-indigo-800 hover:underline"
        >
          Go Home
        </a>
      </div>
      <a
        hx-boost="false"
        href="api/auth/login/google"
        class="display-block rounded-lg bg-slate-800 p-2 text-center text-slate-100 transition duration-200 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-opacity-50"
      >
        Sign In with Google
      </a>
    </div>
  ));
});
