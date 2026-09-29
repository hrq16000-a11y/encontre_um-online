import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import { SearchResults } from "@/components/search-results";
import { buildListingOrFilter, matchingCategoryIds, sanitizeSearchTerm, sanitizeSlug } from "@/lib/search/query";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    city?: string;
    page?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const query = sanitizeSearchTerm(params.q, 80);
  const category = sanitizeSlug(params.category, 120);
  const city = sanitizeSearchTerm(params.city, 80);

  let title = "Buscar serviços, profissionais e negócios";
  if (query) title = `Resultados para "${query}"`;
  else if (category) title = category;
  if (city) title += ` em ${city}`;

  return {
    title,
    description: `Encontre opções${query ? ` para ${query}` : ""}${city ? ` em ${city}` : ""} e entre em contato diretamente quando houver disponibilidade.`,
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = sanitizeSearchTerm(params.q, 120);
  const categorySlug = sanitizeSlug(params.category, 120);
  const city = sanitizeSearchTerm(params.city, 120);
  const page = Math.max(1, Number.parseInt(params.page || "1", 10) || 1);
  const limit = 12;

  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, icon, description")
    .order("name", { ascending: true });

  let listingsQuery = supabase
    .from("listings")
    .select(
      `
      *,
      category:categories(id, name, slug, icon)
    `,
      { count: "exact" },
    )
    .eq("status", "active")
    .order("plan_tier", { ascending: false })
    .order("updated_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (query) {
    const categoryIds = categorySlug
      ? []
      : matchingCategoryIds(categories || [], query);

    listingsQuery = listingsQuery.or(
      buildListingOrFilter(query, categoryIds),
    );
  }

  if (categorySlug) {
    const { data: categoryData } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .maybeSingle();

    if (categoryData) {
      listingsQuery = listingsQuery.eq("category_id", categoryData.id);
    }
  }

  if (city) {
    listingsQuery = listingsQuery.ilike("city", `%${city}%`);
  }

  const { data: listings, count } = await listingsQuery;

  return (
    <SearchResults
      listings={listings || []}
      categories={categories || []}
      total={count || 0}
      currentPage={page}
      totalPages={Math.ceil((count || 0) / limit)}
      query={query}
      categorySlug={categorySlug}
      city={city}
    />
  );
}
