import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import { SearchResults } from "@/components/search-results";

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
  const query = params.q || "";
  const category = params.category || "";
  const city = params.city || "";

  let title = "Buscar Negócios";
  if (query) title = `Resultados para "${query}"`;
  else if (category) title = `${category} - Encontre Um`;
  if (city) title += ` em ${city}`;

  return {
    title: `${title} | Encontre Um`,
    description: `Encontre os melhores profissionais e negócios${query ? ` de ${query}` : ""}${city ? ` em ${city}` : ""}. Contato direto via WhatsApp.`,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || "";
  const categorySlug = params.category || "";
  const city = params.city || "";
  const page = parseInt(params.page || "1");
  const limit = 12;

  const supabase = await createClient();

  // Get categories for filter
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .is("parent_id", null)
    .order("listing_count", { ascending: false });

  // Build listings query
  let listingsQuery = supabase
    .from("listings")
    .select(
      `
      *,
      category:categories(id, name, slug, icon)
    `,
      { count: "exact" }
    )
    .eq("status", "active")
    .order("subscription_tier", { ascending: false })
    .order("average_rating", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (query) {
    listingsQuery = listingsQuery.or(
      `name.ilike.%${query}%,description.ilike.%${query}%`
    );
  }

  if (categorySlug) {
    const { data: categoryData } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .single();

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
