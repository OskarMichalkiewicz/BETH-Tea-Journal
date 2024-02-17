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
