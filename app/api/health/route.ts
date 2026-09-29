import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const startedAt = Date.now();
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("categories")
    .select("*", { count: "exact", head: true });

  const databaseOk = !error;

  return NextResponse.json(
    {
      ok: databaseOk,
      service: "encontreum.online",
      database: databaseOk ? "ok" : "error",
      categories: databaseOk ? count || 0 : undefined,
      latencyMs: Date.now() - startedAt,
      checkedAt: new Date().toISOString(),
    },
    {
      status: databaseOk ? 200 : 503,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
