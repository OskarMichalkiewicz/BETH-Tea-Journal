import { pushToTenantDb } from ".";
import { db } from "../primary";

const journals = await db.query.journal.findMany();

journals.forEach(async (journal) => {
  await pushToTenantDb({
    dbName: journal.database_name,
    authToken: journal.database_auth_token,
    input: true,
  });
  console.log("pushed to tenant db", journal.database_name);
});
