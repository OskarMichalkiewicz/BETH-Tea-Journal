import { Elysia } from "elysia";
import { Sidebar } from "../components/Sidebar";
import { ctx } from "../context";
import { getTenantDb } from "../db/tenant";
import { teas } from "../db/tenant/schema";

export const dashboard = new Elysia()
  .use(ctx)
  .get("/dashboard", async ({ session, html, db }) => {
    if (session) {
      const journalId = session.user.journal_id;
      if (journalId) {
        const journal = await db.query.journal.findFirst({
          where: (journal, { eq }) => eq(journal.id, journalId),
        });

        if (journal) {
          const { tenantDb } = getTenantDb({
            dbName: journal.database_name,
            authToken: journal.database_auth_token,
          });
          const teaKinds = await tenantDb
            .selectDistinct({ kind: teas.kind })
            .from(teas);
          return html(() => (
            <Sidebar
              items={[
                {
                  text: "Teas",
                  path: "/teas",
                  icon: "i-lucide-leaf",
                  subpaths: teaKinds.length
                    ? teaKinds.map(({ kind }) => ({
                        text: kind,
                        path: "/teas",
                        "hx-vals": `{"kind": "${kind}"}`,
                      }))
                    : undefined,
                },
                {
                  text: "Sign Out",
                  path: "/api/auth/signout",
                  icon: "i-lucide-log-out",
                },
              ]}
            >
              <div class="flex flex-col items-center py-3">
                <h1 class="text-2xl font-bold text-slate-100" safe>
                  Hi! {session.user.name}
                </h1>
              </div>
            </Sidebar>
          ));
        }
      }
    }
  });
