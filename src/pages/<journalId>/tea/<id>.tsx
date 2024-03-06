import { Elysia, t } from "elysia";
import { ctx } from "../../../context";
import { getTenantDb } from "../../../db/tenant";

export const id = new Elysia().use(ctx).get(
  "/:journalId/teas/:teaId",
  async ({ db, session, html, params }) => {
    const journal = await db.query.journal.findFirst({
      where: (journal, { eq }) => eq(journal.id, params.journalId),
    });

    if (!journal) {
      return html(() => (
        <div class="flex h-screen flex-col items-center justify-center">
          <h1 class="text-5xl">Journal not found, is the link correct?</h1>
        </div>
      ));
    }

    const { tenantDb } = getTenantDb({
      dbName: journal.database_name,
      authToken: journal.database_auth_token,
    });

    const tea = await tenantDb.query.teas.findFirst({
      where: (teas, { eq }) => eq(teas.id, params.teaId),
    });

    if (!tea) {
      return html(() => (
        <div class="flex h-screen flex-col items-center justify-center">
          <h1 class="text-5xl">Tea not found, is the link correct?</h1>
        </div>
      ));
    }

    if (!session || (session && session?.user.journal_id !== journal.id)) {
      return;
    }

    return html(() => (
      <>
        <div class="text-slate-100">
          <div>{tea.name}</div>
          <div>{tea.kind}</div>
          <div>{tea.description}</div>
        </div>
        <button
          hx-delete={`/api/teas/${journal.id}/${tea.id}`}
          hx-trigger="click"
          class="absolute bottom-5 left-1/2 -translate-x-2/4 rounded-full bg-red-700 hover:bg-red-600 hover:text-slate-200"
        >
          <div class="i-lucide-plus text-7xl text-slate-300" />
        </button>
      </>
    ));
  },
  {
    params: t.Object({
      journalId: t.Numeric(),
      teaId: t.Numeric(),
    }),
  },
);
