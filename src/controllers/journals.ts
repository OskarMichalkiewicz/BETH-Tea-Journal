import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { config } from "../config";
import { ctx } from "../context";
import { journal, journal_user, user } from "../db/primary/schema";
import { pushToTenantDb } from "../db/tenant";
import { createDatabaseId, redirect, syncIfLocal } from "../lib";

export const journalsController = new Elysia({ prefix: "/journals" })
  .use(ctx)
  .post(
    "/",
    async ({ body, session, set, headers, turso, db }) => {
      if (!session) {
        redirect({ set, headers }, "/");
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
        .insert(journal)
        .values({
          name: body.journalName,
          database_name: Name,
          database_auth_token: jwt,
        })
        .returning({
          id: journal.id,
        });

      if (!result) {
        set.status = "Internal Server Error";
        return "Internal Server Error";
      }

      await db.batch([
        db.insert(journal_user).values({
          user_id: session.user.id,
          journal_id: result.id,
          admin: true,
        }),
        db
          .update(user)
          .set({
            journal_id: result.id,
          })
          .where(eq(user.id, session.user.id)),
      ]);

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
    async ({ body: { journalCode }, session, set, headers, db }) => {
      if (!session) {
        redirect({ set, headers }, "/");
        return;
      }
      const journal = await db.query.journal.findFirst({
        where: (journal, { eq }) => eq(journal.database_name, journalCode),
      });

      if (!journal) {
        set.status = "Not Found";
        return "Not Found";
      }

      await db.batch([
        db
          .insert(journal_user)
          .values({
            user_id: session.user.id,
            journal_id: journal.id,
          })
          .onConflictDoNothing(),

        db
          .update(user)
          .set({
            journal_id: journal.id,
          })
          .where(eq(user.id, session.user.id)),
      ]);

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
