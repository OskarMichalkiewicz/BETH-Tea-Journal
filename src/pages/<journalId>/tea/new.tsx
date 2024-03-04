import { Elysia, t } from "elysia";
import { Button } from "../../../components/Button";
import { Modal } from "../../../components/modal";
import { TextArea } from "../../../components/TextArea";
import { TextInput } from "../../../components/TextInput";
import { ctx } from "../../../context";

export const newRoute = new Elysia().use(ctx).get(
  "/:journalId/teas/new",
  async ({ db, html, params }) => {
    const journal = await db.query.journal.findFirst({
      where: (journal, { eq }) => eq(journal.id, params.journalId),
    });
    if (!journal) {
      return html(() => (
        <div class="flex h-screen flex-col items-center justify-center">
          <h1 class="text-5xl">Journal not found.</h1>
        </div>
      ));
    }

    return html(() => (
      <Modal title={"Add tea"}>
        <form
          class="w-96 space-y-4"
          hx-post="/api/teas"
          hx-target="#content"
          hx-target-4xx="#errorMessage"
          hx-target-5xx="#errorMessage"
          hx-swap="innerHTML"
        >
          <TextInput
            label="Name"
            type="text"
            name="name"
            id="name"
            required="true"
            minlength="3"
            maxlength="40"
          />
          <label for="kind" class="block font-medium text-gray-100">
            Kind
          </label>
          <input
            type="dropdown"
            name="kind"
            id="kind"
            placeholder="Enter a name for your tea"
            required="true"
            minlength="3"
            maxlength="40"
            class="mb-3 w-full border-b bg-transparent pb-2 pl-2 focus:border-indigo-400 focus:outline-none"
          />
          <TextArea
            label="Description"
            name="description"
            id="description"
            required="true"
            minlength="10"
            maxlength="500"
            rows="5"
          />
          <input type="hidden" name="journalId" value={journal.id.toString()} />

          <Button
            secondary
            width="full"
            text="Add"
            type="submit"
            data-loading-disable
            _="on submit trigger closeModal"
          />
          <div class=" text-red-400" id="errorMessage" />
        </form>
      </Modal>
    ));
  },
  {
    params: t.Object({
      journalId: t.Numeric(),
    }),
  },
);
