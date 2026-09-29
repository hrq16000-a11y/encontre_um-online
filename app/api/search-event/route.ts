import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { normalizeAttribution } from "@/lib/attribution/server";

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
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
  const resultCount = Number(body.resultCount);
  const attribution = normalizeAttribution(body.attribution);

  if (!query && !city && !categorySlug) {
    return NextResponse.json({ ok: true }, { status: 202 });
  }

  const supabase = await createClient();
  const { error } = await supabase.from("search_events").insert({
    query: query || null,
    city: city || null,
    category_slug: categorySlug || null,
    result_count:
      Number.isFinite(resultCount) && resultCount >= 0
        ? Math.floor(resultCount)
        : 0,
    source_path: clean(body.sourcePath, 240) || "/buscar",
    user_agent: clean(request.headers.get("user-agent"), 500) || null,
    utm_source: attribution.utm_source,
    utm_medium: attribution.utm_medium,
    utm_campaign: attribution.utm_campaign,
    landing_path: attribution.landing_path,
    referrer:
      attribution.referrer ||
      clean(request.headers.get("referer"), 500) ||
      null,
  });

  if (error) {
    console.error("[search-event] insert_failed", { code: error.code });
    return NextResponse.json({ error: "Falha ao registrar busca." }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
