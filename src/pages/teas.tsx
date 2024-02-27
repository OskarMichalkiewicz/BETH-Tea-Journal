import Elysia from "elysia";
import { BaseHtml } from "../components/base";
import { Dashboard } from "../components/dashboard";
import { ctx } from "../context";
import { getTenantDb } from "../db/tenant";
import { redirect } from "../lib";

export const teas = new Elysia()
  .use(ctx)
  .get("/teas", async ({ db, session, set, headers, html }) => {
    if (!session) {
      redirect({ set, headers }, "/login");
      return;
    }
    const journalId = session.user.journal_id;
    if (!journalId) {
      redirect({ set, headers }, "/new-user");
      return;
    }
    const journal = await db.query.journal.findFirst({
      where: (journal, { eq }) => eq(journal.id, journalId),
    });
    if (!journal) {
      redirect({ set, headers }, "/new-user");
      return;
    }
    const { tenantDb } = getTenantDb({
      dbName: journal.database_name,
      authToken: journal.database_auth_token,
    });
    const teaCollection = await tenantDb.query.teas.findMany({
      orderBy: (teas, { desc }) => desc(teas.id),
    });

    return html(() => (
      <BaseHtml>
        <Dashboard>
          {!teaCollection || teaCollection.length === 0 ? (
            <div>You have no teas in this Journal</div>
          ) : (
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {teaCollection.map((tea) => (
                <div class=" relative flex aspect-[6/11] w-11/12 flex-col items-center rounded-full border border-gray-600 bg-gray-700 pt-2">
                  <div class="flex aspect-square w-11/12 items-center justify-center rounded-full bg-gray-800 text-white">
                    Picture
                  </div>
                  <div class="flex w-full flex-col items-start px-[5%]">
                    <p class="text-3xl text-white">{tea.name}</p>
                    <p class="my-2 text-sm text-white">{tea.description}</p>
                    <p class="text-xl text-white">{tea.kind}</p>
                  </div>
                  <a
                    href={`/${journalId}/tea/${tea.id}`}
                    class="border-5 absolute -bottom-5 z-10 flex aspect-square w-1/3 items-center justify-center rounded-full border-gray-900 bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                  >
                    <div class="i-lucide-eye text-[length:2vw]" />
                  </a>
                </div>
              ))}
            </div>
          )}
          <button
            hx-get={`${journalId}/teas/new`}
            hx-target="#modals"
            hx-trigger="click"
            class="absolute bottom-5 left-1/2 -translate-x-2/4 rounded-full bg-green-700 hover:bg-green-600 hover:text-gray-200"
          >
            <div class="i-lucide-plus text-7xl text-gray-300" />
          </button>
        </Dashboard>
      </BaseHtml>
    ));
  });
