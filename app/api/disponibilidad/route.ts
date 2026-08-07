import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../lib/supabaseAdmin";
import { getLocalStore, localFallbackWarning } from "../../../lib/localFallbackStore";

export const dynamic = "force-dynamic";

const hourlySlots = [
  "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
  "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"
];

function sortSlots(slots: string[]) {
  return [...slots].sort((a, b) => hourlySlots.indexOf(a) - hourlySlots.indexOf(b));
}

function getBranch(value: string | null) {
  return value || "Santiago Centro";
}

function getTherapist(value: string | null) {
  return value || "Diego González";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const area = searchParams.get("area");
  const fecha = searchParams.get("fecha");
  const sucursal = getBranch(searchParams.get("sucursal"));
  const masoterapeuta = getTherapist(searchParams.get("masoterapeuta"));

  if (!area || !fecha) {
    return NextResponse.json({ ok: false, error: "Faltan parámetros area y fecha." }, { status: 400 });
  }

  const { client, error: configError } = getSupabaseAdmin();

  if (!client) {
    const store = getLocalStore();
    const disponibilidad = store.disponibilidad.filter(
      (item) =>
        item.area === area &&
        item.fecha === fecha &&
        item.sucursal === sucursal &&
        item.masoterapeuta === masoterapeuta &&
        item.disponible
    );
    const reservas = store.reservas.filter(
      (item) =>
        item.area === area &&
        item.fecha === fecha &&
        item.sucursal === sucursal &&
        item.masoterapeuta === masoterapeuta &&
        item.estado !== "cancelada"
    );
    const reserved = new Set(reservas.map((item) => item.hora));
    const availableFromTable = disponibilidad.map((item) => item.hora);

    return NextResponse.json({
      ok: true,
      mode: "local-fallback",
      warning: configError || localFallbackWarning,
      slots: sortSlots(availableFromTable.filter((slot) => !reserved.has(slot)))
    }, { headers: { "Cache-Control": "no-store" } });
  }

  let availabilityQuery = client
    .from("disponibilidad")
    .select("hora, disponible")
    .eq("area", area)
    .eq("fecha", fecha)
    .eq("disponible", true)
    .eq("sucursal", sucursal)
    .eq("masoterapeuta", masoterapeuta);

  const { data: disponibilidad, error: availabilityError } = await availabilityQuery;

  if (availabilityError) return NextResponse.json({ ok: false, error: availabilityError.message }, { status: 500 });

  const { data: reservas, error: reservationsError } = await client
    .from("reservas")
    .select("hora")
    .eq("area", area)
    .eq("fecha", fecha)
    .eq("sucursal", sucursal)
    .eq("masoterapeuta", masoterapeuta)
    .neq("estado", "cancelada");

  if (reservationsError) return NextResponse.json({ ok: false, error: reservationsError.message }, { status: 500 });

  const reserved = new Set((reservas || []).map((item: any) => item.hora));
  const availableFromTable = (disponibilidad || []).map((item: any) => item.hora);

  return NextResponse.json({
    ok: true,
    mode: "supabase",
    slots: sortSlots(availableFromTable.filter((slot: string) => !reserved.has(slot)))
  }, { headers: { "Cache-Control": "no-store" } });
}
