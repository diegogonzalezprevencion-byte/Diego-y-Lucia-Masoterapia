import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../lib/supabaseAdmin";
import {
  DEFAULT_MONTHLY_OFFERS,
  getCurrentAndNextMonthNumbers,
  normalizeMonthlyOffer,
  sortOffersByMonthList,
  type MonthlyOffer
} from "../../../lib/monthlyOffers";

export const dynamic = "force-dynamic";

export async function GET() {
  const months = getCurrentAndNextMonthNumbers();
  const fallbackOffers = DEFAULT_MONTHLY_OFFERS
    .filter((offer) => months.includes(offer.mes) && offer.activo)
    .map((offer) => normalizeMonthlyOffer(offer));

  const { client } = getSupabaseAdmin();

  if (!client) {
    return NextResponse.json({ ok: true, mode: "local-fallback", months, ofertas: sortOffersByMonthList(fallbackOffers, months) }, { headers: { "Cache-Control": "no-store" } });
  }

  const { data, error } = await client
    .from("ofertas_mensuales")
    .select("id,mes,mes_nombre,titulo,servicio,descripcion,descuento_percent,accent,activo,created_at,updated_at")
    .in("mes", months);

  if (error) {
    return NextResponse.json({ ok: true, mode: "default-fallback", months, warning: error.message, ofertas: sortOffersByMonthList(fallbackOffers, months) }, { headers: { "Cache-Control": "no-store" } });
  }

  const byMonth = new Map<number, MonthlyOffer>((data || []).map((offer: any) => [Number(offer.mes), normalizeMonthlyOffer(offer)]));
  const ofertas = months
    .map((month) => byMonth.get(month) || fallbackOffers.find((offer) => offer.mes === month))
    .filter(Boolean) as MonthlyOffer[];

  const activeOffers = ofertas.filter((offer) => offer.activo);

  return NextResponse.json({ ok: true, mode: "supabase", months, ofertas: sortOffersByMonthList(activeOffers, months) }, { headers: { "Cache-Control": "no-store" } });
}
