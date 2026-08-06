import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export async function GET() {
  const { client, error: configError } = getSupabaseAdmin();
  if (!client) return NextResponse.json({ ok: false, error: configError }, { status: 500 });

  const { data, error } = await client
    .from("newsletter")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, newsletter: data });
}
