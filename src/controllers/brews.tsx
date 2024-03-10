import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { ctx } from "../context";
import { getTenantDb } from "../db/tenant";
import { brew } from "../db/tenant/schema";
import { redirect } from "../lib";

export const BrewsController = new Elysia({ prefix: "/brews" })
  .use(ctx)
  .post(
    "/",
    async ({ body: { planId, time }, session, set, headers, db, html }) => {
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

      const plan = await tenantDb.query.brewing_plan.findFirst({
        where: (plans, { eq }) => eq(plans.id, planId),
      });

      if (!plan) {
        set.status = "Internal Server Error";
        return;
      }

      await tenantDb
        .insert(brew)
        .values({ brewing_plan_id: planId, time: time });

      return html(() => (
        <div
          hx-get="/teas"
          hx-target="#content"
          hx-swap="innerHTML"
          hx-trigger="load"
        />
      ));
    },
    {
      body: t.Object({
        time: t.Numeric(),
        planId: t.Numeric(),
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

      const [removedId] = await tenantDb
        .delete(brew)
        .where(eq(brew.id, id))
        .returning({ id: brew.id });

      if (!removedId) {
        set.status = "Internal Server Error";
        return;
      }

      return html(() => (
        <div
          hx-get="/teas"
          hx-swap="innerHTML"
          hx-target="#content"
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
