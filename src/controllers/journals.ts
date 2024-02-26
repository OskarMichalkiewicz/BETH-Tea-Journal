import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { config } from "../config";
import { ctx } from "../context";
import { journals, user } from "../db/primary/schema";
import { pushToTenantDb } from "../db/tenant";
import { createDatabaseId, redirect, syncIfLocal } from "../lib";

export const journalsController = new Elysia({ prefix: "/journals" })
  .use(ctx)
  .post(
    "/",
    async ({ body, session, set, headers, turso, db }) => {
      if (!session) {
        redirect({ set, headers }, "/login");
        return;
      }
      const dbName = `jr-${createDatabaseId()}`;
      const {
        database: { Name },
      } = await turso.databases.create({
        name: dbName,
        group: "tenants",
      });
      const { jwt } = await turso.logicalDatabases.mintAuthToken(
        config.env.TURSO_JR_SLUG,
        dbName,
      );
      await pushToTenantDb({
        dbName: Name,
        authToken: jwt,
      });
      const [result] = await db
        .insert(journals)
        .values({
          name: body.journalName,
          database_name: Name,
          database_auth_token: jwt,
        })
        .returning({
          id: journals.id,
        });

      if (!result) {
        set.status = "Internal Server Error";
        return "Internal Server Error";
      }

      await db
        .update(user)
        .set({
          journal_id: result.id,
        })
        .where(eq(user.id, session.user.id));

      await syncIfLocal();

      redirect(
        {
          set,
          headers,
        },
        "/teas",
      );
    },
    {
      body: t.Object({
        journalName: t.String({
          minLength: 1,
          maxLength: 30,
        }),
      }),
    },
  )
  .post(
    "/join",
    async ({ body: { journalCode }, session, set, headers, turso, db }) => {
      if (!session) {
        redirect({ set, headers }, "/login");
        return;
      }
      const journal = await db.query.journals.findFirst({
        where: (journals, { eq }) => eq(journals.database_name, journalCode),
      });

      if (!journal) {
        set.status = "Not Found";
        return "Not Found";
      }

      await db
        .update(user)
        .set({
          journal_id: journal.id,
        })
        .where(eq(user.id, session.user.id));

      await syncIfLocal();

      redirect(
        {
          set,
          headers,
        },
        "/teas",
      );
    },
    {
      body: t.Object({
        journalCode: t.String({
          minLength: 10,
          maxLength: 10,
        }),
      }),
    },
  );
