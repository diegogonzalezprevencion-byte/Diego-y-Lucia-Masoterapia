import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../lib/supabaseAdmin";

export const dynamic = "force-dynamic";

const allowedEvents = new Set(["page_view", "click"]);

function cleanText(value: unknown, max = 240) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function cleanNumber(value: unknown) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const eventType = cleanText(payload.event_type, 40);

    if (!allowedEvents.has(eventType)) {
      return NextResponse.json({ ok: false, error: "Tipo de evento no permitido." }, { status: 400 });
    }

    const { client } = getSupabaseAdmin();

    // Si Supabase no está configurado, no bloquea la navegación del visitante.
    if (!client) return NextResponse.json({ ok: true, mode: "local-fallback" });

    const headers = request.headers;
    const country = cleanText(headers.get("x-vercel-ip-country"), 12);
    const city = cleanText(headers.get("x-vercel-ip-city"), 120);

    const { error } = await client.from("analytics_events").insert({
      event_type: eventType,
      visitor_id: cleanText(payload.visitor_id, 180),
      session_id: cleanText(payload.session_id, 180),
      path: cleanText(payload.path, 260),
      page_title: cleanText(payload.page_title, 220),
      referrer: cleanText(payload.referrer, 320),
      element_text: cleanText(payload.element_text, 220),
      element_tag: cleanText(payload.element_tag, 60),
      element_href: cleanText(payload.element_href, 320),
      element_id: cleanText(payload.element_id, 120),
      element_classes: cleanText(payload.element_classes, 260),
      screen_width: cleanNumber(payload.screen_width),
      screen_height: cleanNumber(payload.screen_height),
      language: cleanText(payload.language, 60),
      user_agent: cleanText(payload.user_agent || headers.get("user-agent"), 520),
      country,
      city,
      utm_source: cleanText(payload.utm_source, 140),
      utm_medium: cleanText(payload.utm_medium, 140),
      utm_campaign: cleanText(payload.utm_campaign, 180),
      utm_term: cleanText(payload.utm_term, 180),
      utm_content: cleanText(payload.utm_content, 220)
    });

    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "No se pudo registrar analítica." }, { status: 400 });
  }
}
