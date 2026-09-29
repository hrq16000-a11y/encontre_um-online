import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function clean(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const query = clean(body.query, 160);
  const city = clean(body.city, 120);
  const categorySlug = clean(body.categorySlug, 120);
  const sourcePath = clean(body.sourcePath, 240);
  const resultCount = Number.isFinite(Number(body.resultCount))
    ? Math.max(0, Math.min(100000, Number(body.resultCount)))
    : 0;

  if (!query && !city && !categorySlug) {
    return NextResponse.json({ ok: true }, { status: 202 });
  }

  const supabase = await createClient();
  const { error } = await supabase.from("search_events").insert({
    query: query || null,
    city: city || null,
    category_slug: categorySlug || null,
    result_count: resultCount,
    source_path: sourcePath || "/buscar",
    user_agent: clean(request.headers.get("user-agent"), 500) || null,
  });

  if (error) {
    console.error("[search-event] insert_failed", { code: error.code });
    return NextResponse.json({ error: "Falha ao registrar busca." }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
