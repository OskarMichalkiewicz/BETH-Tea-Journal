import { Elysia } from "elysia";
import { Button } from "../components/Button";
import { TextInput } from "../components/TextInput";
import { ctx } from "../context";

export const newUser = new Elysia()
  .use(ctx)
  .get("/new-user", async ({ session, html }) => {
    return html(() => (
      <main
        hx-ext="response-targets"
        class="flex h-screen w-full flex-col items-center gap-5 p-8"
      >
        <h1 safe class="font-semiblod text-center text-3xl text-slate-100">
          Thanks for signing up {session?.user.name}
        </h1>
        <h1 safe class="font-semiblod text-center text-2xl text-slate-100">
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
  });
