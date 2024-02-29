import Elysia from "elysia";
import { BaseHtml } from "../components/base";
import { Button } from "../components/Button";
import { TextInput } from "../components/TextInput";
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
          class="flex h-screen w-full flex-col items-center gap-5 p-8"
        >
          <h1 safe class="font-semiblod text-center text-3xl text-gray-100">
            Thanks for signing up {session.user.name}
          </h1>
          <h1 safe class="font-semiblod text-center text-2xl text-gray-100">
            please create a journal or join one to get started
          </h1>
          <div class="space-y-8 rounded-lg border border-gray-700 bg-gray-800 p-8 shadow-md">
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
                class="group relative mb-2 me-2 inline-flex w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 p-0.5 text-sm font-medium text-gray-50 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:bg-gray-600 group-hover:from-purple-600 group-hover:to-blue-500 "
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
      </BaseHtml>
    ));
  });
