import type * as auth from "../auth";

/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = auth.Auth;
  interface DatabaseUserAttributes {
    name: string;
    picture: string;
    email?: string | null;
  }
  interface DatabaseSessionAttributes {}
}
