import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { ctx } from "../context";
import { getTenantDb } from "../db/tenant";
import { teas } from "../db/tenant/schema";
import { redirect } from "../lib";

export const TeasController = new Elysia({ prefix: "/teas" })
  .use(ctx)
  .post(
    "/",
    async ({
      body: { journalId, description, kind, name },
      session,
      set,
      headers,
      db,
    }) => {
      if (!session) {
        redirect({ set, headers }, "/login");
        return;
      }

      const journal = await db.query.journals.findFirst({
        where: (journals, { eq }) => eq(journals.id, journalId),
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

      redirect({ set, headers }, `${journalId}/teas/${tea.id}`);
    },
    {
      body: t.Object({
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
  .post(
    "/edit",
    async ({
      body: { journalId, teaId, name, description, kind },
      session,
      set,
      headers,
      db,
    }) => {
      if (!session) {
        redirect({ set, headers }, "/login");
      }

      const journal = await db.query.journals.findFirst({
        where: (journals, { eq }) => eq(journals.id, journalId),
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

      redirect({ set, headers }, `${journalId}/teas/${tea.id}`);
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
    "/:journalId/:id",
    async ({ params: { journalId, id }, session, set, headers, db }) => {
      if (!session) {
        redirect({ set, headers }, "/login");
      }

      const journal = await db.query.journals.findFirst({
        where: (journals, { eq }) => eq(journals.id, journalId),
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

      redirect({ set, headers }, `/teas`);
    },
    {
      params: t.Object({
        journalId: t.Numeric(),
        id: t.Numeric(),
      }),
    },
  );
