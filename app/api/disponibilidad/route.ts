import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../lib/supabaseAdmin";
import { getLocalStore, localFallbackWarning } from "../../../lib/localFallbackStore";

export const dynamic = "force-dynamic";

const defaultSlots = ["09:00", "10:00", "11:00", "12:00", "15:00", "16:00", "17:00", "18:00"];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const area = searchParams.get("area");
  const fecha = searchParams.get("fecha");

  if (!area || !fecha) {
    return NextResponse.json({ ok: false, error: "Faltan parámetros area y fecha." }, { status: 400 });
  }

  const { client, error: configError } = getSupabaseAdmin();

  if (!client) {
    const store = getLocalStore();
    const disponibilidad = store.disponibilidad.filter(
      (item) => item.area === area && item.fecha === fecha && item.disponible
    );
    const reservas = store.reservas.filter(
      (item) => item.area === area && item.fecha === fecha && item.estado !== "cancelada"
    );
    const reserved = new Set(reservas.map((item) => item.hora));
    const availableFromTable = disponibilidad.map((item) => item.hora);
    const base = availableFromTable.length > 0 ? availableFromTable : defaultSlots;

    return NextResponse.json({
      ok: true,
      mode: "local-fallback",
      warning: configError || localFallbackWarning,
      slots: base.filter((slot) => !reserved.has(slot))
    });
  }

  const { data: disponibilidad, error: availabilityError } = await client
    .from("disponibilidad")
    .select("hora, disponible")
    .eq("area", area)
    .eq("fecha", fecha)
    .eq("disponible", true);

  if (availabilityError) return NextResponse.json({ ok: false, error: availabilityError.message }, { status: 500 });

  const { data: reservas, error: reservationsError } = await client
    .from("reservas")
    .select("hora")
    .eq("area", area)
    .eq("fecha", fecha)
    .neq("estado", "cancelada");

  if (reservationsError) return NextResponse.json({ ok: false, error: reservationsError.message }, { status: 500 });

  const reserved = new Set((reservas || []).map((item: any) => item.hora));
  const availableFromTable = (disponibilidad || []).map((item: any) => item.hora);
  const base = availableFromTable.length > 0 ? availableFromTable : defaultSlots;

  return NextResponse.json({ ok: true, mode: "supabase", slots: base.filter((slot) => !reserved.has(slot)) });
}
