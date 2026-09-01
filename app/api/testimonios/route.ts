import { NextResponse } from "next/server";
import { createLocalId, getLocalStore, localFallbackWarning } from "../../../lib/localFallbackStore";
import { getSupabaseAdmin } from "../../../lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export async function GET() {
  const { client, error: configError } = getSupabaseAdmin();

  if (!client) {
    const store = getLocalStore();
    const testimonios = [...(store.testimonios || [])]
      .filter((item) => item.activo)
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
    .select("id,nombre,edad,servicio_realizado,comentario,created_at")
    .eq("activo", true)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, mode: "supabase", testimonios: data || [] }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.nombre || !body.servicio_realizado || !body.comentario) {
      return NextResponse.json({ ok: false, error: "Faltan nombre, servicio realizado o comentario." }, { status: 400 });
    }

    const payload = {
      nombre: String(body.nombre).trim(),
      edad: body.edad ? Number(body.edad) : null,
      servicio_realizado: String(body.servicio_realizado).trim(),
      comentario: String(body.comentario).trim(),
      categoria: "masoterapia",
      activo: false
    };

    if (!payload.nombre || !payload.servicio_realizado || !payload.comentario) {
      return NextResponse.json({ ok: false, error: "Completa los campos obligatorios." }, { status: 400 });
    }

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
  } catch {
    return NextResponse.json({ ok: false, error: "No se pudo procesar el testimonio." }, { status: 400 });
  }
}
