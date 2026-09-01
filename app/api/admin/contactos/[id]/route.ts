import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../../lib/supabaseAdmin";
import { getLocalStore, localFallbackWarning } from "../../../../../lib/localFallbackStore";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  if (typeof body.revisado !== "boolean") {
    return NextResponse.json({ ok: false, error: "Falta el estado revisado." }, { status: 400 });
  }

  const { client, error: configError } = getSupabaseAdmin();

  if (!client) {
    const store = getLocalStore();
    const contacto = store.contactos.find((item) => item.id === id);
    if (!contacto) return NextResponse.json({ ok: false, error: "Contacto no encontrado." }, { status: 404 });
    contacto.revisado = body.revisado;
    contacto.revisado_at = body.revisado ? new Date().toISOString() : null;
    return NextResponse.json({
      ok: true,
      mode: "local-fallback",
      warning: configError || localFallbackWarning,
      contacto
    });
  }

  const updateData = {
    revisado: body.revisado,
    revisado_at: body.revisado ? new Date().toISOString() : null
  };

  const { data, error } = await client
    .from("contactos")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, mode: "supabase", contacto: data });
}
