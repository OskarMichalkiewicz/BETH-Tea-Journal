import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { ctx } from "../context";
import { getTenantDb } from "../db/tenant";
import { brewing_plan } from "../db/tenant/schema";
import { redirect } from "../lib";

export const BrewingPlansController = new Elysia({ prefix: "/brewingPlans" })
  .use(ctx)
  .post(
    "/new",
    async ({ body: { teaId, name }, session, set, headers, db, html }) => {
      if (!session) {
        redirect({ set, headers }, "/");
        return;
      }
      const journalId = session?.user.journal_id;
      if (!journalId) {
        redirect({ set, headers }, "/");
        return;
      }

      const journal = await db.query.journal.findFirst({
        where: (journal, { eq }) => eq(journal.id, journalId),
      });

      if (!journal) {
        set.status = "Forbidden";
        return;
      }

      const { tenantDb } = getTenantDb({
        dbName: journal.database_name,
        authToken: journal.database_auth_token,
      });

      const tea = await tenantDb.query.teas.findFirst({
        where: (teas, { eq }) => eq(teas.id, teaId),
      });

      if (!tea) {
        set.status = "Internal Server Error";
        return;
      }

      await tenantDb.insert(brewing_plan).values({ tea_id: teaId, name: name });

      return html(() => (
        <div
          hx-get={`/${journalId}/plans/${teaId}`}
          hx-swap="innerHTML"
          hx-target="#plans-side"
          hx-trigger="load"
        />
      ));
    },
    {
      body: t.Object({
        name: t.String({ minLength: 3, maxLength: 20 }),
        teaId: t.Numeric(),
      }),
    },
  )
  .delete(
    "/:id",
    async ({ params: { id }, session, set, headers, db, html }) => {
      if (!session) {
        redirect({ set, headers }, "/");
        return;
      }
      const journalId = session.user.journal_id;
      if (!journalId) {
        redirect({ set, headers }, "/");
        return;
      }

      const journal = await db.query.journal.findFirst({
        where: (journal, { eq }) => eq(journal.id, journalId),
      });

      if (!journal) {
        set.status = "Forbidden";
        return;
      }

      const { tenantDb } = getTenantDb({
        dbName: journal.database_name,
        authToken: journal.database_auth_token,
      });

      const [plan] = await tenantDb
        .delete(brewing_plan)
        .where(eq(brewing_plan.id, id))
        .returning();

      if (!plan) {
        set.status = "Internal Server Error";
        return;
      }

      return html(() => (
        <div
          hx-get={`/${journalId}/plans/${plan.tea_id}`}
          hx-swap="innerHTML"
          hx-target="#plans-side"
          hx-trigger="load"
        />
      ));
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    },
  );
