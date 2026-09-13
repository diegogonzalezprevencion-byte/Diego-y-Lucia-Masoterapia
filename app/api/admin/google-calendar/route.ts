import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    status: "preparado",
    calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
    message: "Google Calendar está preparado a nivel de estructura. Falta conectar OAuth real."
  });
}

export async function POST(request: Request) {
  const { client, error: configError } = getSupabaseAdmin();
  if (!client) return NextResponse.json({ ok: false, error: configError }, { status: 500 });

  const body = await request.json();

  if (!body.reserva_id) {
    return NextResponse.json({ ok: false, error: "Falta reserva_id." }, { status: 400 });
  }

  const { data: reserva, error: reservaError } = await client
    .from("reservas")
    .select("*")
    .eq("id", body.reserva_id)
    .single();

  if (reservaError) return NextResponse.json({ ok: false, error: reservaError.message }, { status: 500 });

  const payload = {
    summary: `${reserva.area} - ${reserva.servicio}`,
    description: `Reserva de ${reserva.nombre}. Teléfono: ${reserva.telefono}. Email: ${reserva.email}.`,
    date: reserva.fecha,
    time: reserva.hora,
    calendarId: process.env.GOOGLE_CALENDAR_ID || "primary"
  };

  const { data, error } = await client
    .from("calendar_events")
    .insert({
      reserva_id: body.reserva_id,
      estado: "preparado",
      payload
    })
    .select()
    .single();

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  return NextResponse.json({
    ok: true,
    calendar_event: data,
    message: "Evento preparado. Falta conexión OAuth real con Google Calendar."
  });
}
