import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";
import { getLocalStore, localFallbackWarning, sortByDateAndTime } from "../../../../lib/localFallbackStore";
import { getTodayISO, getTomorrowISO } from "../../../../lib/reminders";
import { reminder24hMessage, reminderSameDayMessage, reminderScheduledMessage } from "../../../../lib/whatsapp";

export const dynamic = "force-dynamic";

function mapReminders(rows: any[], today: string, tomorrow: string) {
  return rows.map((reserva: any) => {
    const reminderType = reserva.fecha === tomorrow ? "24h" : reserva.fecha === today ? "same_day" : "future";
    const reminderMessage =
      reminderType === "same_day"
        ? reminderSameDayMessage(reserva)
        : reminderType === "24h"
          ? reminder24hMessage(reserva)
          : reminderScheduledMessage(reserva);
    return { ...reserva, reminderType, reminderMessage };
  });
}

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const type = searchParams.get("type") || "all";
  const masoterapeuta = searchParams.get("masoterapeuta") || "all";
  const today = getTodayISO();
  const tomorrow = getTomorrowISO();
  const { client, error: configError } = getSupabaseAdmin();

  if (!client) {
    const store = getLocalStore();
    let rows = store.reservas.filter((item) => item.estado !== "cancelada");
    if (masoterapeuta !== "all") rows = rows.filter((item) => (item.masoterapeuta || "Diego González") === masoterapeuta);
    if (type === "24h") rows = rows.filter((item) => item.fecha === tomorrow && !item.recordatorio_24h_enviado);
    if (type === "same_day") rows = rows.filter((item) => item.fecha === today && !item.recordatorio_dia_enviado);
    return NextResponse.json({
      ok: true,
      mode: "local-fallback",
      warning: configError || localFallbackWarning,
      reminders: mapReminders(sortByDateAndTime(rows), today, tomorrow),
      today,
      tomorrow
    });
  }

  let query = client
    .from("reservas")
    .select("*")
    .neq("estado", "cancelada")
    .order("fecha", { ascending: true })
    .order("hora", { ascending: true });

  if (masoterapeuta !== "all") query = query.eq("masoterapeuta", masoterapeuta);
  if (type === "24h") query = query.eq("fecha", tomorrow).eq("recordatorio_24h_enviado", false);
  if (type === "same_day") query = query.eq("fecha", today).eq("recordatorio_dia_enviado", false);

  const { data, error } = await query;
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, mode: "supabase", reminders: mapReminders(data || [], today, tomorrow), today, tomorrow });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  if (!body.id || !["24h", "same_day"].includes(body.type)) {
    return NextResponse.json({ ok: false, error: "Faltan id o tipo de recordatorio válido." }, { status: 400 });
  }

  const { client, error: configError } = getSupabaseAdmin();

  if (!client) {
    const store = getLocalStore();
    const reserva = store.reservas.find((item) => item.id === body.id);
    if (!reserva) return NextResponse.json({ ok: false, error: "Reserva no encontrada." }, { status: 404 });
    if (body.type === "24h") reserva.recordatorio_24h_enviado = true;
    if (body.type === "same_day") reserva.recordatorio_dia_enviado = true;
    reserva.ultimo_recordatorio_at = new Date().toISOString();
    return NextResponse.json({ ok: true, mode: "local-fallback", warning: configError || localFallbackWarning, reserva });
  }

  const updateData = body.type === "24h"
    ? { recordatorio_24h_enviado: true, ultimo_recordatorio_at: new Date().toISOString() }
    : { recordatorio_dia_enviado: true, ultimo_recordatorio_at: new Date().toISOString() };

  const { data, error } = await client.from("reservas").update(updateData).eq("id", body.id).select().single();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, mode: "supabase", reserva: data });
}
