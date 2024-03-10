import { Elysia, t } from "elysia";
import { Button } from "../../../../components/Button";
import { ctx } from "../../../../context";
import { getTenantDb } from "../../../../db/tenant";

export const brewingPlans = new Elysia().use(ctx).get(
  ":journalId/plans/:teaId",
  async ({ db, session, html, params }) => {
    if (!session || !session.user.journal_id) {
      return;
    }
    const journalId = session.user.journal_id;
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

    const plans = await tenantDb.query.brewing_plan.findMany({
      where: (plans, { eq }) => eq(plans.tea_id, +params.teaId),
    });

    if (journalId !== journal.id) {
      return;
    }

    return html(() => (
      <>
        <div class="space-y-6">
          <ul class="space-y-2 text-xl font-medium">
            {plans.map(({ name, id }) => (
              <li class="p-x-6 w-full rounded-lg border border-slate-500 bg-slate-700 pb-2 pt-4">
                <h1>{name}</h1>
                <div class="flex">
                  <button
                    type="button"
                    class="i-lucide-x text-3xl"
                    hx-delete={`/api/brewingPlans/${id}`}
                    hx-swap="innerHTML"
                    hx-target="#plans-side"
                  />
                </div>
              </li>
            ))}
          </ul>
          <Button
            primary
            width="full"
            text="New plan"
            hx-get={`/${params.journalId}/plans/${params.teaId}/add`}
            hx-swap="outerHTML"
          />
        </div>
      </>
    ));
  },
  {
    params: t.Object({
      teaId: t.String(),
      journalId: t.String(),
    }),
  },
);
