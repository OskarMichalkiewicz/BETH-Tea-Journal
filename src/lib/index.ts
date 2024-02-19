import { init } from "@paralleldrive/cuid2";
import { config } from "../config";
import { client } from "../db/primary";

const createId = init({
  length: 7,
});

export function createDatabaseId() {
  return createId();
}

export async function syncIfLocal() {
  if (config.env.DATABASE_CONNECTION_TYPE === "local-replica") {
    await client.sync();
  }
}

export function redirect(
  {
    set,
    headers,
  }: {
    set: {
      headers: Record<string, string | null> & {
        "Set-Cookie"?: string | string[];
      };
      status?: number | string;
      redirect?: string;
    };
    headers: Record<string, string | null>;
  },
  href: string,
) {
  if (headers["hx-request"] === "true") {
    set.headers["HX-Location"] = href;
  } else {
    set.redirect = href;
  }
}
