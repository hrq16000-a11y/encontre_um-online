import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const city = searchParams.get("city") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");
  const offset = (page - 1) * limit;

  const supabase = await createClient();

  let queryBuilder = supabase
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
    .order("review_count", { ascending: false })
    .range(offset, offset + limit - 1);

  if (query) {
    queryBuilder = queryBuilder.or(
      `name.ilike.%${query}%,description.ilike.%${query}%`
    );
  }

  if (category) {
    const { data: categoryData } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", category)
      .single();

    if (categoryData) {
      queryBuilder = queryBuilder.eq("category_id", categoryData.id);
    }
  }

  if (city) {
    queryBuilder = queryBuilder.ilike("city", `%${city}%`);
  }

  const { data: listings, error, count } = await queryBuilder;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    listings: listings || [],
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit),
  });
}
