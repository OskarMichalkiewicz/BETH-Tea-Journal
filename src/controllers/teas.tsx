import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { ctx } from "../context";
import { getTenantDb } from "../db/tenant";
import { teas } from "../db/tenant/schema";
import { redirect } from "../lib";
import { teaTypes } from "../types/contants";

export const TeasController = new Elysia({ prefix: "/teas" })
  .use(ctx)
  .post(
    "/",
    async ({
      body: { description, kind, name },
      session,
      set,
      headers,
      db,
      html,
    }) => {
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

      const [tea] = await tenantDb
        .insert(teas)
        .values({ name, description, kind })
        .returning();

      if (!tea) {
        set.status = "Internal Server Error";
        return;
      }
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
        name: t.String({
          minLength: 5,
          maxLength: 20,
        }),
        kind: t.Enum(teaTypes),
        description: t.String({
          minLength: 5,
          maxLength: 255,
        }),
        journalId: t.Numeric(),
      }),
    },
  )
  .post(
    "/edit",
    async ({
      body: { teaId, name, description, kind },
      session,
      set,
      headers,
      db,
    }) => {
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

      const [tea] = await tenantDb
        .update(teas)
        .set({ name, description, kind })
        .where(eq(teas.id, teaId))
        .returning();

      if (!tea) {
        set.status = "Internal Server Error";
        return;
      }
    },
    {
      body: t.Object({
        teaId: t.Numeric(),
        name: t.String({
          minLength: 5,
          maxLength: 20,
        }),
        kind: t.Enum({
          ["Pu Ehr"]: "Pu Ehr",
          Heicha: "Heicha",
          Yellow: "Yellow",
          Black: "Black",
          Green: "Green",
          Matcha: "Matcha",
          White: "White",
        }),
        description: t.String({
          minLength: 5,
          maxLength: 255,
        }),
        journalId: t.Numeric(),
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

      const [tea] = await tenantDb
        .delete(teas)
        .where(eq(teas.id, +id))
        .returning({ id: teas.id });

      if (!tea) {
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
