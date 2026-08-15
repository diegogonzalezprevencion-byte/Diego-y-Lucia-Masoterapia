import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";
import { getLocalStore, localFallbackWarning } from "../../../../lib/localFallbackStore";

export const dynamic = "force-dynamic";
const iso = (date: Date) => date.toISOString().slice(0, 10);

function buildDashboard(rows: any[]) {
  const today = iso(new Date());
  const now = new Date();
  const weekEnd = new Date();
  weekEnd.setDate(now.getDate() + 7);
  const monthEnd = new Date();
  monthEnd.setMonth(now.getMonth() + 1);
  const counts = new Map<string, number>();
  rows.forEach((row: any) => counts.set(row.servicio, (counts.get(row.servicio) || 0) + 1));
  const services = [...counts.entries()]
    .map(([servicio, count]) => ({ servicio, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return {
    total: rows.length,
    today: rows.filter((row: any) => row.fecha === today).length,
    week: rows.filter((row: any) => row.fecha >= today && row.fecha <= iso(weekEnd)).length,
    month: rows.filter((row: any) => row.fecha >= today && row.fecha <= iso(monthEnd)).length,
    services
  };
}

export async function GET() {
  const { client, error: configError } = getSupabaseAdmin();

  if (!client) {
    const store = getLocalStore();
    return NextResponse.json({ ok: true, mode: "local-fallback", warning: configError || localFallbackWarning, ...buildDashboard(store.reservas) });
  }

  const { data, error } = await client.from("reservas").select("*");
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, mode: "supabase", ...buildDashboard(data || []) });
}
