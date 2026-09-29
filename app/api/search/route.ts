import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = (searchParams.get("q") || "").trim().slice(0, 160);
  const category = (searchParams.get("category") || "").trim().slice(0, 120);
  const city = (searchParams.get("city") || "").trim().slice(0, 120);
  const page = Math.max(1, Number.parseInt(searchParams.get("page") || "1", 10) || 1);
  const limit = Math.min(
    24,
    Math.max(1, Number.parseInt(searchParams.get("limit") || "12", 10) || 12),
  );
  const offset = (page - 1) * limit;

  const supabase = await createClient();

  let queryBuilder = supabase
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
    .range(offset, offset + limit - 1);

  if (query) {
    queryBuilder = queryBuilder.or(
      `title.ilike.%${query}%,description.ilike.%${query}%`,
    );
  }

  if (category) {
    const { data: categoryData } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", category)
      .maybeSingle();

    if (categoryData) {
      queryBuilder = queryBuilder.eq("category_id", categoryData.id);
    }
  }

  if (city) {
    queryBuilder = queryBuilder.ilike("city", `%${city}%`);
  }

  const { data: listings, error, count } = await queryBuilder;

  if (error) {
    console.error("[search] query_failed", { code: error.code });
    return NextResponse.json({ error: "Falha ao buscar opções." }, { status: 500 });
  }

  return NextResponse.json({
    listings: listings || [],
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit),
  });
}
