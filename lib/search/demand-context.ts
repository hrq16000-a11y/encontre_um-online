/** Context is derived only from the actual search, never from a generic invented service. */
export function demandContext(
  query: string,
  categorySlug: string,
  categories: ReadonlyArray<{ slug: string; name: string }>,
  city: string,
) {
  return {
    query: query.trim() || categories.find(category => category.slug === categorySlug)?.name.trim() || "",
    city: city.trim(),
  };
}

/** Only a real insert confirmation is success; 202 is the existing honeypot response. */
export function confirmedDemand(status: number, data: unknown): data is { ok: true; message: string } {
  if (status !== 201 || !data || typeof data !== "object") return false;
  const value = data as { ok?: unknown; message?: unknown };
  return value.ok === true && typeof value.message === "string" && value.message.trim().length > 0;
}
