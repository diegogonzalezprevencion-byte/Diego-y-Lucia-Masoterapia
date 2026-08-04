import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";
import { getLocalStore, localFallbackWarning } from "../../../../lib/localFallbackStore";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = await request.json();

  if (!["pendiente", "confirmada", "cancelada"].includes(body.estado)) {
    return NextResponse.json({ ok: false, error: "Estado no válido." }, { status: 400 });
  }

  const { client, error: configError } = getSupabaseAdmin();

  if (!client) {
    const store = getLocalStore();
    const reserva = store.reservas.find((item) => item.id === id);
    if (!reserva) return NextResponse.json({ ok: false, error: "Reserva no encontrada." }, { status: 404 });
    reserva.estado = body.estado;
    return NextResponse.json({ ok: true, mode: "local-fallback", warning: configError || localFallbackWarning, reserva });
  }

  const { data, error } = await client.from("reservas").update({ estado: body.estado }).eq("id", id).select().single();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, mode: "supabase", reserva: data });
}
