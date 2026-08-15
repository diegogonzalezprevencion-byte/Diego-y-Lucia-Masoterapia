import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";
import { createLocalId, getLocalStore, localFallbackWarning, sortByDateAndTime } from "../../../../lib/localFallbackStore";

export const dynamic = "force-dynamic";

function getBranch(value: string | null | undefined) {
  return value || "Santiago Centro";
}

function getTherapist(value: string | null | undefined) {
  return value || "Diego González";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const area = searchParams.get("area");
  const fecha = searchParams.get("fecha");
  const sucursal = searchParams.get("sucursal");
  const masoterapeuta = searchParams.get("masoterapeuta");
  const { client, error: configError } = getSupabaseAdmin();

  if (!client) {
    const store = getLocalStore();
    const filtered = store.disponibilidad.filter((item) => {
      if (area && item.area !== area) return false;
      if (fecha && item.fecha !== fecha) return false;
      if (sucursal && item.sucursal !== sucursal) return false;
      if (masoterapeuta && item.masoterapeuta !== masoterapeuta) return false;
      return true;
    });

    return NextResponse.json({
      ok: true,
      mode: "local-fallback",
      warning: configError || localFallbackWarning,
      disponibilidad: sortByDateAndTime(filtered)
    }, { headers: { "Cache-Control": "no-store" } });
  }

  let query = client
    .from("disponibilidad")
    .select("*")
    .order("fecha", { ascending: true })
    .order("hora", { ascending: true });

  if (area) query = query.eq("area", area);
  if (fecha) query = query.eq("fecha", fecha);
  if (sucursal) query = query.eq("sucursal", sucursal);
  if (masoterapeuta) query = query.eq("masoterapeuta", masoterapeuta);

  const { data, error } = await query;

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, mode: "supabase", disponibilidad: data }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.area || !body.fecha || !body.hora) {
    return NextResponse.json({ ok: false, error: "Faltan area, fecha u hora." }, { status: 400 });
  }

  const { client, error: configError } = getSupabaseAdmin();
  const disponible = body.disponible === false ? false : true;
  const sucursal = getBranch(body.sucursal);
  const masoterapeuta = getTherapist(body.masoterapeuta);

  if (!client) {
    const store = getLocalStore();
    const existing = store.disponibilidad.find(
      (item) =>
        item.area === body.area &&
        item.fecha === body.fecha &&
        item.hora === body.hora &&
        item.sucursal === sucursal &&
        item.masoterapeuta === masoterapeuta
    );

    if (existing) {
      existing.disponible = disponible;
      return NextResponse.json({
        ok: true,
        mode: "local-fallback",
        warning: configError || localFallbackWarning,
        disponibilidad: existing
      });
    }

    const item = {
      id: createLocalId("disp"),
      area: body.area,
      fecha: body.fecha,
      hora: body.hora,
      sucursal,
      masoterapeuta,
      disponible,
      created_at: new Date().toISOString()
    };
    store.disponibilidad.push(item);

    return NextResponse.json({
      ok: true,
      mode: "local-fallback",
      warning: configError || localFallbackWarning,
      disponibilidad: item
    });
  }

  const { data, error } = await client
    .from("disponibilidad")
    .upsert(
      { area: body.area, fecha: body.fecha, hora: body.hora, sucursal, masoterapeuta, disponible },
      { onConflict: "area,fecha,hora,sucursal,masoterapeuta" }
    )
    .select()
    .single();

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, mode: "supabase", disponibilidad: data }, { headers: { "Cache-Control": "no-store" } });
}

export async function DELETE(request: Request) {
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false, error: "Falta id." }, { status: 400 });

  const { client, error: configError } = getSupabaseAdmin();

  if (!client) {
    const store = getLocalStore();
    store.disponibilidad = store.disponibilidad.filter((item) => item.id !== id);
    return NextResponse.json({ ok: true, mode: "local-fallback", warning: configError || localFallbackWarning });
  }

  const { error } = await client.from("disponibilidad").delete().eq("id", id);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, mode: "supabase" });
}
