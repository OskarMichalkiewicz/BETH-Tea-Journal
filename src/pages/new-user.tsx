import Elysia from "elysia";
import { BaseHtml } from "../components/base";
import { ctx } from "../context";
import { redirect } from "../lib";

export const newUser = new Elysia()
  .use(ctx)
  .get("/new-user", async ({ html, session, set, headers, db }) => {
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
    const journalId = session.user.journal_id;
    if (journalId) {
      const journal = await db.query.journal.findFirst({
        where: (journal, { eq }) => eq(journal.id, journalId),
      });
      if (journal) {
        redirect({ set, headers }, "/teas");
      }
    }
    return html(() => (
      <BaseHtml>
        <main
          hx-ext="response-targets"
          class="flex h-screen w-full flex-col items-center justify-center gap-5 bg-gray-200"
        >
          <h1 safe class="font-semiblod text-center text-3xl">
            Thanks for signing up {session.user.name}, please create or join a
            journal to get started.
          </h1>
          <form
            hx-post="/api/journals"
            hx-target-4xx="next #errorMessage"
            hx-target-5xx="next #errorMessage"
            hx-swap="innerHTML"
            class="w-96 space-y-3 rounded-lg bg-white p-8 shadow-md"
          >
            <label
              for="journalName"
              class="block text-sm font-medium text-gray-600"
            >
              Journal Name
            </label>
            <input
              name="journalName"
              type="text"
              id="journalName"
              placeholder="Enter journal name"
              required="true"
              minlength="1"
              maxlength="30"
              pattern="[a-zA-Z0-9]+"
              class="w-full rounded-md border p-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              type="submit"
              data-loading-disable
              class="block flex w-full items-center justify-center rounded-md bg-indigo-600 p-2 text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              Create Journal
              <div
                data-loading
                class="i-lucide-loader-2 ml-2 animate-spin text-2xl"
              />
            </button>
            <div class="text-red-400" id="errorMessage" />
          </form>
          <form
            hx-post="/api/journals/join"
            hx-swap="innerHTML"
            hx-target-4xx="#errorMessageJoin"
            hx-target-5xx="#errorMessageJoin"
            data-loading-states
            class="w-96 space-y-3 rounded-lg bg-white p-8 shadow-md"
          >
            <label
              for="journalCode"
              class="block text-sm font-medium text-gray-600"
            >
              Join with Code
            </label>
            <input
              type="text"
              name="journalCode"
              placeholder="Enter code"
              required="true"
              pattern="^jr-[a-z0-9]{7}$"
              class="w-full rounded-md border p-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              type="submit"
              data-loading-disable
              class="flex w-full items-center justify-center rounded-md bg-green-600 p-2 text-white hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              Jon Organization
              <div
                data-loading
                class="i-lucide-loader-2 ml-2 animate-spin text-2xl"
              />
            </button>
            <div id="errorMessageJoin" class=" text-red-500"></div>
          </form>
        </main>
      </BaseHtml>
    ));
  });
