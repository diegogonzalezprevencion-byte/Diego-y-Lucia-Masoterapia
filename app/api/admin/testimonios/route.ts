import { NextResponse } from "next/server";
import { createLocalId, getLocalStore, localFallbackWarning } from "../../../../lib/localFallbackStore";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

export const dynamic = "force-dynamic";

function buildPayload(body: any) {
  return {
    nombre: body.nombre,
    edad: body.edad || null,
    servicio_realizado: body.servicio_realizado,
    comentario: body.comentario,
    activo: body.activo !== false,
    categoria: "masoterapia"
  };
}

export async function GET() {
  const { client, error: configError } = getSupabaseAdmin();

  if (!client) {
    const store = getLocalStore();
    const testimonios = [...(store.testimonios || [])]
      .sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""));

    return NextResponse.json({
      ok: true,
      mode: "local-fallback",
      warning: configError || localFallbackWarning,
      testimonios
    }, { headers: { "Cache-Control": "no-store" } });
  }

  const { data, error } = await client
    .from("testimonios")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, mode: "supabase", testimonios: data || [] }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.nombre || !body.servicio_realizado || !body.comentario) {
    return NextResponse.json({ ok: false, error: "Faltan nombre, servicio realizado o comentario." }, { status: 400 });
  }

  const payload = buildPayload(body);
  const { client, error: configError } = getSupabaseAdmin();

  if (!client) {
    const store = getLocalStore();
    const testimonio = {
      id: createLocalId("testimonio"),
      ...payload,
      created_at: new Date().toISOString()
    };
    store.testimonios.push(testimonio);

    return NextResponse.json({
      ok: true,
      mode: "local-fallback",
      warning: configError || localFallbackWarning,
      testimonio
    });
  }

  const { data, error } = await client
    .from("testimonios")
    .insert(payload)
    .select()
    .single();

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, mode: "supabase", testimonio: data });
}

export async function PATCH(request: Request) {
  const body = await request.json();

  if (!body.id) {
    return NextResponse.json({ ok: false, error: "Falta el ID del testimonio." }, { status: 400 });
  }

  const updateData: Record<string, any> = {};

  if ("nombre" in body) updateData.nombre = body.nombre;
  if ("edad" in body) updateData.edad = body.edad || null;
  if ("servicio_realizado" in body) updateData.servicio_realizado = body.servicio_realizado;
  if ("comentario" in body) updateData.comentario = body.comentario;
  if ("activo" in body) updateData.activo = Boolean(body.activo);

  const { client, error: configError } = getSupabaseAdmin();

  if (!client) {
    const store = getLocalStore();
    const testimonio = store.testimonios.find((item) => item.id === body.id);
    if (!testimonio) return NextResponse.json({ ok: false, error: "Testimonio no encontrado." }, { status: 404 });

    Object.assign(testimonio, updateData);

    return NextResponse.json({
      ok: true,
      mode: "local-fallback",
      warning: configError || localFallbackWarning,
      testimonio
    });
  }

  const { data, error } = await client
    .from("testimonios")
    .update(updateData)
    .eq("id", body.id)
    .select()
    .single();

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, mode: "supabase", testimonio: data });
}

export async function DELETE(request: Request) {
  const id = new URL(request.url).searchParams.get("id");

  if (!id) {
    return NextResponse.json({ ok: false, error: "Falta el ID del testimonio." }, { status: 400 });
  }

  const { client, error: configError } = getSupabaseAdmin();

  if (!client) {
    const store = getLocalStore();
    const index = store.testimonios.findIndex((item) => item.id === id);
    if (index === -1) return NextResponse.json({ ok: false, error: "Testimonio no encontrado." }, { status: 404 });

    const [testimonio] = store.testimonios.splice(index, 1);

    return NextResponse.json({
      ok: true,
      mode: "local-fallback",
      warning: configError || localFallbackWarning,
      testimonio
    });
  }

  const { data, error } = await client
    .from("testimonios")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, mode: "supabase", testimonio: data });
}
