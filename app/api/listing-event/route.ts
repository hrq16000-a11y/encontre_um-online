import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const EVENT_TYPES = new Set([
  "whatsapp_click",
  "phone_click",
  "website_click",
]);

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const listingId = typeof body.listingId === "string" ? body.listingId.trim() : "";
  const eventType = typeof body.eventType === "string" ? body.eventType.trim() : "";

  if (!listingId || !EVENT_TYPES.has(eventType)) {
    return NextResponse.json({ error: "Evento inválido." }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase.from("analytics_events").insert({
    listing_id: listingId,
    event_type: eventType,
    user_agent: request.headers.get("user-agent")?.slice(0, 500) || null,
  });

  if (error) {
    console.error("[listing-event] insert_failed", { code: error.code });
    return NextResponse.json({ error: "Falha ao registrar evento." }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
