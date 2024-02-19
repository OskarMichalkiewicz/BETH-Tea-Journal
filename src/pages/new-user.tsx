import Elysia from "elysia";
import { BaseHtml } from "../components/base";
import { ctx } from "../context";
import { redirect } from "../lib";

export const newUser = new Elysia()
  .use(ctx)
  .get("/new-user", async ({ html, session, set, headers }) => {
    if (!session) {
      redirect(
        {
          set,
          headers,
        },
        "/login",
      );
      return;
    }
    return html(() => (
      <BaseHtml>
        <main class="flex w-full flex-col items-center justify-center gap-5">
          <h1 safe class="text-3xl font-bold">
            hi new user {session.user.name}
          </h1>
          <p>do you want to create a new tea journal?</p>
          <form
            hx-post="/api/journals"
            class="flex flex-col items-center justify-center gap-5"
          >
            <input name="journalName" placeholder="journal name" />
            <button type="submit">create journal</button>
          </form>
          <form
            hx-post="/api/journals/join"
            class="flex flex-col items-center justify-center gap-5"
          >
            <input name="journalCode" placeholder="journal code" />
            <button type="submit">join journal</button>
          </form>
        </main>
      </BaseHtml>
    ));
  });
