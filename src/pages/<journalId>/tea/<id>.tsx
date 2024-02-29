import { Elysia, t } from "elysia";
import { BaseHtml } from "../../../components/base";
import { Dashboard } from "../../../components/dashboard";
import { ctx } from "../../../context";
import { getTenantDb } from "../../../db/tenant";
import { redirect } from "../../../lib";

export const id = new Elysia().use(ctx).get(
  "/:journalId/teas/:teaId",
  async ({ db, session, set, headers, html, params }) => {
    const journal = await db.query.journal.findFirst({
      where: (journal, { eq }) => eq(journal.id, params.journalId),
    });

    if (!journal) {
      return html(() => (
        <BaseHtml>
          <div class="flex h-screen flex-col items-center justify-center">
            <h1 class="text-5xl">Journal not found, is the link correct?</h1>
          </div>
        </BaseHtml>
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
        <BaseHtml>
          <div class="flex h-screen flex-col items-center justify-center">
            <h1 class="text-5xl">Tea not found, is the link correct?</h1>
          </div>
        </BaseHtml>
      ));
    }

    if (!session || (session && session?.user.journal_id !== journal.id)) {
      redirect(
        {
          set,
          headers,
        },
        "/teas",
      );
      return;
    }

    return html(() => (
      <BaseHtml>
        <Dashboard>
          <div class="text-gray-100">
            <div>{tea.name}</div>
            <div>{tea.kind}</div>
            <div>{tea.description}</div>
          </div>
          <button
            hx-delete={`/api/teas/${journal.id}/${tea.id}`}
            hx-trigger="click"
            class="absolute bottom-5 left-1/2 -translate-x-2/4 rounded-full bg-red-700 hover:bg-red-600 hover:text-gray-200"
          >
            <div class="i-lucide-plus text-7xl text-gray-300" />
          </button>
        </Dashboard>
      </BaseHtml>
    ));
  },
  {
    params: t.Object({
      journalId: t.Numeric(),
      teaId: t.Numeric(),
    }),
  },
);
