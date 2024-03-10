import { Elysia, t } from "elysia";
import { Button } from "../../../../components/Button";
import { TextInput } from "../../../../components/TextInput";
import { ctx } from "../../../../context";
import { getTenantDb } from "../../../../db/tenant";

export const add = new Elysia().use(ctx).get(
  "/:journalId/plans/:teaId/add",
  async ({ db, html, session, params }) => {
    if (!session) {
      return;
    }
    const journalId = session.user.journal_id;
    if (!journalId) {
      return;
    }

    const journal = await db.query.journal.findFirst({
      where: (journal, { eq }) => eq(journal.id, journalId),
    });
    if (!journal) {
      return;
    }

    const { tenantDb } = getTenantDb({
      dbName: journal.database_name,
      authToken: journal.database_auth_token,
    });

    const tea = await tenantDb.query.teas.findFirst({
      where: (teas, { eq }) => eq(teas.id, params.teaId),
    });

    if (!tea) {
      return;
    }

    return html(() => (
      <form
        class="p-x-6 w-full rounded-lg border border-slate-700 bg-slate-900 pb-2 pt-4"
        hx-post="/api/brewingPlans/new"
        hx-target-4xx="#errorMessage"
        hx-target-5xx="#errorMessage"
        hx-swap="outerHTML"
      >
        <div class="flex items-baseline justify-end">
          <button
            type="button"
            class="i-lucide-x text-3xl"
            hx-get={`/${params.journalId}/plans/${params.teaId}`}
            hx-swap="innerHTML"
            hx-target="#plans-side"
          />
        </div>
        <TextInput
          secondary
          label="Name"
          type="text"
          name="name"
          id="name"
          required="true"
          class="mb-6"
        />
        <input type="hidden" name="teaId" value={params.teaId.toString()} />

        <Button
          secondary
          width="full"
          text="Add"
          type="submit"
          data-loading-disable
        />
        <div class=" text-red-400" id="errorMessage" />
      </form>
    ));
  },
  {
    params: t.Object({
      teaId: t.Numeric(),
      journalId: t.Numeric(),
    }),
  },
);
