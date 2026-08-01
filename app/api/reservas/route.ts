import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../lib/supabaseAdmin";
import { createLocalId, getLocalStore, localFallbackWarning, sortByDateAndTime } from "../../../lib/localFallbackStore";
import { reservationWhatsAppMessage } from "../../../lib/whatsapp";

export const dynamic = "force-dynamic";

export async function GET() {
  const { client, error: configError } = getSupabaseAdmin();

  if (!client) {
    const store = getLocalStore();
    return NextResponse.json({
      ok: true,
      mode: "local-fallback",
      warning: configError || localFallbackWarning,
      reservas: sortByDateAndTime(store.reservas)
    });
  }

  const { data, error } = await client
    .from("reservas")
    .select("*")
    .order("fecha", { ascending: true })
    .order("hora", { ascending: true });

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, mode: "supabase", reservas: data });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    for (const field of ["area", "servicio", "fecha", "hora", "nombre", "email", "telefono"]) {
      if (!body[field]) return NextResponse.json({ ok: false, error: `Falta el campo ${field}` }, { status: 400 });
    }

    const { client, error: configError } = getSupabaseAdmin();

    if (!client) {
      const store = getLocalStore();
      const existingReservation = store.reservas.find(
        (item) => item.area === body.area && item.fecha === body.fecha && item.hora === body.hora && item.estado !== "cancelada"
      );
      if (existingReservation) return NextResponse.json({ ok: false, error: "Este horario ya fue reservado." }, { status: 409 });

      const reserva = {
        id: createLocalId("res"),
        area: body.area,
        servicio: body.servicio,
        fecha: body.fecha,
        hora: body.hora,
        nombre: body.nombre,
        email: body.email,
        telefono: body.telefono,
        estado: "pendiente" as const,
        recordatorio_24h_enviado: false,
        recordatorio_dia_enviado: false,
        ultimo_recordatorio_at: null,
        created_at: new Date().toISOString()
      };
      store.reservas.push(reserva);

      return NextResponse.json({
        ok: true,
        mode: "local-fallback",
        warning: configError || localFallbackWarning,
        reserva,
        automation: { whatsappMessage: reservationWhatsAppMessage(body), emailPrepared: true, remindersPrepared: true }
      }, { status: 201 });
    }

    const { data: existingReservation } = await client
      .from("reservas")
      .select("id")
      .eq("area", body.area)
      .eq("fecha", body.fecha)
      .eq("hora", body.hora)
      .neq("estado", "cancelada")
      .maybeSingle();

    if (existingReservation) return NextResponse.json({ ok: false, error: "Este horario ya fue reservado." }, { status: 409 });

    const { data, error } = await client
      .from("reservas")
      .insert({ ...body, estado: "pendiente", recordatorio_24h_enviado: false, recordatorio_dia_enviado: false })
      .select()
      .single();

    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

    return NextResponse.json({
      ok: true,
      mode: "supabase",
      reserva: data,
      automation: { whatsappMessage: reservationWhatsAppMessage(body), emailPrepared: true, remindersPrepared: true }
    }, { status: 201 });
  } catch {
    return NextResponse.json({ ok: false, error: "No se pudo procesar la solicitud." }, { status: 400 });
  }
}
