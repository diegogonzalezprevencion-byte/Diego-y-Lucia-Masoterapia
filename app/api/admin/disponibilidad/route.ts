import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";
import { createLocalId, getLocalStore, localFallbackWarning, sortByDateAndTime } from "../../../../lib/localFallbackStore";

export const dynamic = "force-dynamic";

export async function GET() {
  const { client, error: configError } = getSupabaseAdmin();

  if (!client) {
    const store = getLocalStore();
    return NextResponse.json({
      ok: true,
      mode: "local-fallback",
      warning: configError || localFallbackWarning,
      disponibilidad: sortByDateAndTime(store.disponibilidad)
    });
  }

  const { data, error } = await client
    .from("disponibilidad")
    .select("*")
    .order("fecha", { ascending: true })
    .order("hora", { ascending: true });

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, mode: "supabase", disponibilidad: data });
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.area || !body.fecha || !body.hora) {
    return NextResponse.json({ ok: false, error: "Faltan area, fecha u hora." }, { status: 400 });
  }

  const { client, error: configError } = getSupabaseAdmin();

  if (!client) {
    const store = getLocalStore();
    const existing = store.disponibilidad.find(
      (item) => item.area === body.area && item.fecha === body.fecha && item.hora === body.hora
    );

    if (existing) {
      existing.disponible = body.disponible ?? true;
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
      disponible: body.disponible ?? true,
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
      { area: body.area, fecha: body.fecha, hora: body.hora, disponible: body.disponible ?? true },
      { onConflict: "area,fecha,hora" }
    )
    .select()
    .single();

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, mode: "supabase", disponibilidad: data });
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
