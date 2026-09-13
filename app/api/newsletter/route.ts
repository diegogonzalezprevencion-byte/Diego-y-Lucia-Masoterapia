import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { client, error: configError } = getSupabaseAdmin();
  if (!client) return NextResponse.json({ ok: false, error: configError }, { status: 500 });

  try {
    const body = await request.json();
    if (!body.email) {
      return NextResponse.json({ ok: false, error: "Falta correo." }, { status: 400 });
    }

    const { data, error } = await client
      .from("newsletter")
      .upsert({
        email: body.email,
        nombre: body.nombre || "",
        interes: body.interes || "general",
        activo: true
      }, { onConflict: "email,interes" })
      .select()
      .single();

    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, newsletter: data });
  } catch {
    return NextResponse.json({ ok: false, error: "No se pudo procesar la suscripción." }, { status: 400 });
  }
}
