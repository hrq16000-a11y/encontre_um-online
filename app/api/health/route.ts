import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function networkCause(error: unknown) {
  if (!(error instanceof Error)) return "unknown";

  const cause = error.cause as
    | { code?: string; name?: string }
    | undefined;

  return cause?.code || cause?.name || error.name || "unknown";
}

export async function GET() {
  const startedAt = Date.now();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("[health] supabase_config_missing", {
      urlConfigured: Boolean(supabaseUrl),
      keyConfigured: Boolean(supabaseKey),
    });

    return NextResponse.json(
      {
        ok: false,
        service: "encontreum.online",
        configuration: "error",
        database: "not_checked",
        latencyMs: Date.now() - startedAt,
        checkedAt: new Date().toISOString(),
      },
      {
        status: 503,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }

  try {
    const probeUrl = new URL("/rest/v1/categories", supabaseUrl);
    probeUrl.searchParams.set("select", "id");
    probeUrl.searchParams.set("limit", "1");

    const probe = await fetch(probeUrl, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });

    if (!probe.ok) {
      console.error("[health] supabase_upstream_http_error", {
        status: probe.status,
      });

      return NextResponse.json(
        {
          ok: false,
          service: "encontreum.online",
          configuration: "ok",
          upstream: "reachable",
          database: "error",
          latencyMs: Date.now() - startedAt,
          checkedAt: new Date().toISOString(),
        },
        {
          status: 503,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }
  } catch (error) {
    console.error("[health] supabase_upstream_unreachable", {
      cause: networkCause(error),
    });

    return NextResponse.json(
      {
        ok: false,
        service: "encontreum.online",
        configuration: "ok",
        upstream: "unreachable",
        database: "not_checked",
        latencyMs: Date.now() - startedAt,
        checkedAt: new Date().toISOString(),
      },
      {
        status: 503,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }

  const supabase = await createClient();
  const { count, error } = await supabase
    .from("categories")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("[health] database_query_failed", {
      code: error.code || "",
      message: error.message || "",
    });
  }

  const databaseOk = !error;

  return NextResponse.json(
    {
      ok: databaseOk,
      service: "encontreum.online",
      configuration: "ok",
      upstream: "reachable",
      database: databaseOk ? "ok" : "error",
      categories: databaseOk ? count || 0 : undefined,
      latencyMs: Date.now() - startedAt,
      checkedAt: new Date().toISOString(),
    },
    {
      status: databaseOk ? 200 : 503,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
