import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../lib/supabaseAdmin";
import { createLocalId, getLocalStore, localFallbackWarning } from "../../../lib/localFallbackStore";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.nombre || !body.email || !body.mensaje) {
      return NextResponse.json({ ok: false, error: "Faltan nombre, email o mensaje." }, { status: 400 });
    }

    const payload = {
      nombre: body.nombre,
      email: body.email,
      telefono: body.telefono || "",
      mensaje: body.mensaje,
      origen: "web",
      revisado: false
    };

    const { client, error: configError } = getSupabaseAdmin();

    if (!client) {
      const store = getLocalStore();
      const contacto = {
        id: createLocalId("contacto"),
        ...payload,
        created_at: new Date().toISOString(),
        revisado_at: null
      };
      store.contactos.push(contacto);

      return NextResponse.json({
        ok: true,
        mode: "local-fallback",
        warning: configError || localFallbackWarning,
        contacto,
        automation: { emailPrepared: true, contactEmail: process.env.CONTACT_EMAIL || "No configurado" }
      });
    }

    const { data, error } = await client
      .from("contactos")
      .insert(payload)
      .select()
      .single();

    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

    return NextResponse.json({
      ok: true,
      mode: "supabase",
      contacto: data,
      automation: { emailPrepared: true, contactEmail: process.env.CONTACT_EMAIL || "No configurado" }
    });
  } catch {
    return NextResponse.json({ ok: false, error: "No se pudo procesar el contacto." }, { status: 400 });
  }
}
