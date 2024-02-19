import type * as auth from "../auth";

/// <reference types="lucia" />
declare global {
  namespace Lucia {
    type Auth = auth.Auth;
    type DatabaseUserAttributes = {
      name: string;
      picture: string;
      email?: string | null;
      journal_id?: number | null;
    };
    type DatabaseSessionAttributes = {};
  }
}
