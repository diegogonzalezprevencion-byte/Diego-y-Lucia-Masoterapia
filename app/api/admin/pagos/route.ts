import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export async function GET() {
  const { client, error: configError } = getSupabaseAdmin();
  if (!client) return NextResponse.json({ ok: false, error: configError }, { status: 500 });

  const { data, error } = await client
    .from("pagos")
    .select("*, reservas(*)")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, pagos: data, provider: process.env.PAYMENT_PROVIDER || "pendiente" });
}

export async function POST(request: Request) {
  const { client, error: configError } = getSupabaseAdmin();
  if (!client) return NextResponse.json({ ok: false, error: configError }, { status: 500 });

  const body = await request.json();

  const { data, error } = await client
    .from("pagos")
    .insert({
      reserva_id: body.reserva_id || null,
      monto: body.monto || 0,
      estado: "preparado",
      metodo: body.metodo || process.env.PAYMENT_PROVIDER || "pendiente"
    })
    .select()
    .single();

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  return NextResponse.json({
    ok: true,
    pago: data,
    message: "Pago preparado. Falta conectar proveedor real."
  });
}
