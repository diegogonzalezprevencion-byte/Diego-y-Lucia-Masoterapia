import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";
import { getLocalStore, localFallbackWarning } from "../../../../lib/localFallbackStore";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const estado = new URL(request.url).searchParams.get("estado") || "all";
  const { client, error: configError } = getSupabaseAdmin();

  if (!client) {
    const store = getLocalStore();
    let contactos = [...store.contactos];
    if (estado === "revisado") contactos = contactos.filter((item) => item.revisado);
    if (estado === "no-revisado") contactos = contactos.filter((item) => !item.revisado);
    contactos.sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""));
    return NextResponse.json({
      ok: true,
      mode: "local-fallback",
      warning: configError || localFallbackWarning,
      contactos
    }, { headers: { "Cache-Control": "no-store" } });
  }

  let query = client
    .from("contactos")
    .select("*")
    .order("created_at", { ascending: false });

  if (estado === "revisado") query = query.eq("revisado", true);
  if (estado === "no-revisado") query = query.eq("revisado", false);

  const { data, error } = await query;
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, mode: "supabase", contactos: data || [] }, { headers: { "Cache-Control": "no-store" } });
}
