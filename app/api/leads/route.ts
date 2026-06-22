import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { client, error: configError } = getSupabaseAdmin();
  if (!client) return NextResponse.json({ ok: false, error: configError }, { status: 500 });

  try {
    const body = await request.json();
    if (!body.email && !body.telefono) {
      return NextResponse.json({ ok: false, error: "Debes ingresar correo o teléfono." }, { status: 400 });
    }

    const { data, error } = await client
      .from("leads")
      .insert({
        nombre: body.nombre || "",
        email: body.email || "",
        telefono: body.telefono || "",
        interes: body.interes || "general",
        origen: body.origen || "web"
      })
      .select()
      .single();

    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, lead: data });
  } catch {
    return NextResponse.json({ ok: false, error: "No se pudo procesar el lead." }, { status: 400 });
  }
}
