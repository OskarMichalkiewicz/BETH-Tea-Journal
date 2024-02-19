import Elysia from "elysia";
import { BaseHtml } from "../components/base";
import { ctx } from "../context";
import { redirect } from "../lib";

export const dashboard = new Elysia()
  .use(ctx)
  .get("/dashboard", async ({ db, session, set, headers, html }) => {
    if (!session) {
      redirect({ set, headers }, "/login");
      return;
    }
    const journalId = session.user.journal_id;
    if (!journalId) {
      redirect({ set, headers }, "/new-user");
      return;
    }
    const journal = await db.query.journals.findFirst({
      where: (journals, { eq }) => eq(journals.id, journalId),
    });
    if (!journal) {
      redirect({ set, headers }, "/new-user");
      return;
    }
    return html(() => (
      <BaseHtml>
        <h1>Dashboard - {journal.name} - {session.user.name}</h1>
      </BaseHtml>
    ));
  });
