import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function normalizeText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  // Honeypot: bots tend to fill hidden fields.
  if (normalizeText(body.company, 100)) {
    return NextResponse.json({ ok: true }, { status: 202 });
  }

  const query = normalizeText(body.query, 160);
  const city = normalizeText(body.city, 120);
  const requesterName = normalizeText(body.requesterName, 100);
  const whatsapp = normalizeText(body.whatsapp, 40);

  if (query.length < 2 || whatsapp.replace(/\D/g, "").length < 10) {
    return NextResponse.json(
      { error: "Informe o que precisa e um WhatsApp válido." },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.from("demand_requests").insert({
    query,
    city: city || null,
    requester_name: requesterName || null,
    whatsapp,
    source_path: normalizeText(body.sourcePath, 200) || "/buscar",
    referrer: normalizeText(request.headers.get("referer"), 500) || null,
    user_agent: normalizeText(request.headers.get("user-agent"), 500) || null,
  });

  if (error) {
    console.error("[demand-capture] insert_failed", { code: error.code });
    return NextResponse.json(
      { error: "Não foi possível registrar sua solicitação agora." },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      ok: true,
      message: "Recebemos sua procura. Vamos usar isso para buscar opções na sua região.",
    },
    { status: 201 },
  );
}
