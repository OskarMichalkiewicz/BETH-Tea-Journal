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
      <div class="flex">
        <div class="relative w-full justify-evenly p-6 text-slate-100">
          <div>{tea.name}</div>
          <div>{tea.kind}</div>
          <div>{tea.description}</div>
          <button
            hx-delete={`/api/teas/${tea.id}`}
            hx-trigger="click"
            class="w-18 absolute bottom-6 left-1/2 flex aspect-square -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-rose-800 p-2 hover:from-red-400 hover:to-rose-600 hover:text-slate-200"
          >
            <div class="i-lucide-trash text-5xl text-slate-300" />
          </button>
        </div>
        <aside class="relative min-w-64 border-l border-slate-700 bg-slate-800 text-slate-200">
          <div class="sticky top-0 flex h-screen flex-col overflow-y-auto px-5 py-6">
            <h1 class="mb-4 text-2xl">Brewing Plans</h1>
            <div
              id="plans-side"
              hx-get={`/${params.journalId}/plans/${tea.id}`}
              hx-trigger="load"
            ></div>
          </div>
        </aside>
      </div>
    ));
  },
  {
    params: t.Object({
      journalId: t.Numeric(),
      teaId: t.Numeric(),
    }),
  },
);
