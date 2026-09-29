export type SearchCategory = {
  id: string;
  name: string;
  slug: string;
};

export function sanitizeSearchTerm(value: string | null | undefined, max = 120) {
  return (value || "")
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export function sanitizeSlug(value: string | null | undefined, max = 120) {
  return (value || "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, max);
}

function normalizeForMatch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function matchingCategoryIds(
  categories: SearchCategory[],
  rawQuery: string,
) {
  const query = normalizeForMatch(rawQuery);
  if (query.length < 3) return [];

  return categories
    .filter((category) => {
      const name = normalizeForMatch(category.name);
      const slug = normalizeForMatch(category.slug);
      return (
        name.includes(query) ||
        query.includes(name) ||
        slug.includes(query) ||
        query.includes(slug)
      );
    })
    .map((category) => category.id);
}

export function buildListingOrFilter(
  query: string,
  categoryIds: string[] = [],
) {
  const filters = [
    `title.ilike.%${query}%`,
    `description.ilike.%${query}%`,
  ];

  if (categoryIds.length) {
    filters.push(`category_id.in.(${categoryIds.join(",")})`);
  }

  return filters.join(",");
}
