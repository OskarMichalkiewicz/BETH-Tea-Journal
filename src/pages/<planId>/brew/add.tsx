import { Elysia, t } from "elysia";
import { Button } from "../../../components/Button";
import { TextInput } from "../../../components/TextInput";
import { ctx } from "../../../context";
import { getTenantDb } from "../../../db/tenant";

export const newRoute = new Elysia().use(ctx).get(
  "/:planId/brew/new",
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

    const plan = await tenantDb.query.brewing_plan.findFirst({
      where: (plan, { eq }) => eq(plan.id, params.planId),
    });

    if (!plan) {
      return;
    }

    return html(() => (
      <form
        class="w-96 space-y-4 rounded-lg border border-slate-700 bg-slate-600"
        hx-post="/api/brews"
        hx-target="#content"
        hx-target-4xx="#errorMessage"
        hx-target-5xx="#errorMessage"
        hx-swap="outerHTML"
      >
        <TextInput
          label="Time"
          type="text"
          name="time"
          id="time"
          required="true"
          pattern="[0-9]+"
        />
        <input
          type="hidden"
          name="brewingPlanId"
          value={params.planId.toString()}
        />

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
      planId: t.Numeric(),
    }),
  },
);
