import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function csvCell(value: unknown) {
  const text = value == null ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("demand_requests")
    .select(
      "query, city, requester_name, whatsapp, status, utm_source, utm_medium, utm_campaign, landing_path, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(5000);

  if (error) {
    console.error("[admin-export] demand_query_failed", { code: error.code });
    return NextResponse.json({ error: "Falha ao exportar." }, { status: 500 });
  }

  const headers = [
    "query",
    "city",
    "requester_name",
    "whatsapp",
    "status",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "landing_path",
    "created_at",
  ];

  const rows = (data || []).map((row) =>
    headers.map((key) => csvCell(row[key as keyof typeof row])).join(","),
  );

  const csv = [headers.join(","), ...rows].join("\r\n");
  const date = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="encontreum-leads-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
