import { Elysia, t } from "elysia";
import { BaseHtml } from "../../../components/base";
import { Modal } from "../../../components/modal";
import { ctx } from "../../../context";

export const newRoute = new Elysia().use(ctx).get(
  "/:journalId/teas/new",
  async ({ db, html, params }) => {
    const journal = await db.query.journal.findFirst({
      where: (journal, { eq }) => eq(journal.id, params.journalId),
    });
    if (!journal) {
      return html(() => (
        <BaseHtml>
          <div class="flex h-screen flex-col items-center justify-center">
            <h1 class="text-5xl">
              Organization not found, is the link correct?
            </h1>
          </div>
        </BaseHtml>
      ));
    }

    return html(() => (
      <Modal title={"Add tea"}>
        <form
          class="w-96"
          hx-post="/api/teas"
          hx-target-4xx="#errorMessage"
          hx-target-5xx="#errorMessage"
          hx-swap="innerHTML"
        >
          <label for="name" class="block  font-medium text-white">
            Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Enter a name for your tea"
            required="true"
            minlength="3"
            maxlength="40"
            class="m-0 mb-3 w-full border-b bg-transparent pb-2 pl-2 focus:border-indigo-400 focus:outline-none"
          />
          <label for="kind" class="block font-medium text-white">
            Kind
          </label>
          <input
            type="dropdown"
            name="kind"
            placeholder="Enter a name for your tea"
            required="true"
            minlength="3"
            maxlength="40"
            class="mb-3 w-full border-b bg-transparent pb-2 pl-2 focus:border-indigo-400 focus:outline-none"
          />
          <label for="description" class="block font-medium text-white">
            Description
          </label>
          <textarea
            name="description"
            placeholder="Please describe your issue in detail"
            required="true"
            minlength="10"
            maxlength="500"
            rows="5"
            class="mb-3 w-full border bg-transparent p-2 focus:border-indigo-400 focus:outline-none"
          />
          <input type="hidden" name="journalId" value={journal.id.toString()} />

          <button
            type="submit"
            data-loading-disable
            class="flex w-full items-center justify-center border p-2 text-white hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
            _="trigger closeModal"
          >
            Submit Ticket
            <div
              data-loading
              class="i-lucide-loader-2 ml-2 animate-spin text-2xl"
            />
          </button>
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
