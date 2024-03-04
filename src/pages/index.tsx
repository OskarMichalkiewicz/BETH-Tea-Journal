import { Elysia } from "elysia";
import { Button } from "../components/Button";
import { Sidebar } from "../components/Sidebar";
import { TextInput } from "../components/TextInput";
import { ctx } from "../context";

export const index = new Elysia()
  .use(ctx)
  .get("/index", async ({ session, html, db }) => {
    if (session) {
      const journalId = session.user.journal_id;
      if (journalId) {
        const journal = await db.query.journal.findFirst({
          where: (journal, { eq }) => eq(journal.id, journalId),
        });
        if (journal) {
          return html(() => (
            <Sidebar>
              <div class="flex flex-col items-center py-3">
                <h1 class="text-2xl font-bold text-slate-100" safe>
                  Hi! {session.user.name}
                </h1>
              </div>
            </Sidebar>
          ));
        } else if (true) {
          return html(() => (
            <main
              hx-ext="response-targets"
              class="flex h-screen w-full flex-col items-center gap-5 p-8"
            >
              <h1
                safe
                class="font-semiblod text-center text-3xl text-slate-100"
              >
                Thanks for signing up {session.user.name}
              </h1>
              <h1
                safe
                class="font-semiblod text-center text-2xl text-slate-100"
              >
                please create a journal or join one to get started
              </h1>
              <div class="space-y-8 rounded-lg border border-slate-700 bg-slate-800 p-8 shadow-md">
                <form
                  hx-post="/api/journals"
                  hx-target-4xx="next #errorMessage"
                  hx-target-5xx="next #errorMessage"
                  hx-swap="innerHTML"
                  class="w-80 space-y-4"
                >
                  <TextInput
                    primary
                    label="Journal Name"
                    name="journalName"
                    id="journalName"
                    required="true"
                    minlength="1"
                    maxlength="30"
                    pattern="[a-zA-Z0-9]+"
                  />
                  <Button
                    primary
                    text="Create a Journal"
                    type="submit"
                    data-loading-disable
                    class="group relative mb-2 me-2 inline-flex w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 p-0.5 text-sm font-medium text-slate-50 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:bg-slate-600 group-hover:from-purple-600 group-hover:to-blue-500 "
                  />
                  <div class="text-red-400" id="errorMessage" />
                </form>
                <form
                  hx-post="/api/journals/join"
                  hx-swap="innerHTML"
                  hx-target-4xx="#errorMessageJoin"
                  hx-target-5xx="#errorMessageJoin"
                  data-loading-states
                  class="w-80 space-y-4"
                >
                  <TextInput
                    secondary
                    label="Journal Code"
                    name="journalCode"
                    id="journalCode"
                    required="true"
                    pattern="^jr-[a-z0-9]{7}$"
                  />
                  <Button
                    type="submit"
                    secondary
                    text={"Join with code"}
                    data-loading-disable
                  />
                  <div id="errorMessageJoin" class=" text-red-500"></div>
                </form>
              </div>
            </main>
          ));
        }
      }
    } else {
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
    }
  });
