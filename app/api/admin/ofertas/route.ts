import { NextResponse } from "next/server";
import { createLocalId, getLocalStore, localFallbackWarning } from "../../../../lib/localFallbackStore";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";
import { DEFAULT_MONTHLY_OFFERS, mergeWithDefaultOffers, normalizeMonthlyOffer } from "../../../../lib/monthlyOffers";

export const dynamic = "force-dynamic";

function ensureLocalOffers() {
  const store = getLocalStore();
  if (!store.ofertas_mensuales.length) {
    store.ofertas_mensuales = DEFAULT_MONTHLY_OFFERS.map((offer) => ({
      id: createLocalId("oferta"),
      ...offer,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
  }
  return store.ofertas_mensuales;
}

export async function GET() {
  const { client, error: configError } = getSupabaseAdmin();

  if (!client) {
    return NextResponse.json({
      ok: true,
      mode: "local-fallback",
      warning: configError || localFallbackWarning,
      ofertas: mergeWithDefaultOffers(ensureLocalOffers())
    }, { headers: { "Cache-Control": "no-store" } });
  }

  const { data, error } = await client
    .from("ofertas_mensuales")
    .select("*")
    .order("mes", { ascending: true });

  if (error) {
    return NextResponse.json({
      ok: true,
      mode: "default-fallback",
      warning: `No se pudo leer la tabla ofertas_mensuales: ${error.message}`,
      ofertas: DEFAULT_MONTHLY_OFFERS
    }, { headers: { "Cache-Control": "no-store" } });
  }

  return NextResponse.json({ ok: true, mode: "supabase", ofertas: mergeWithDefaultOffers(data || []) }, { headers: { "Cache-Control": "no-store" } });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const month = Number(body.mes);

  if (!month || month < 1 || month > 12) {
    return NextResponse.json({ ok: false, error: "Mes inválido." }, { status: 400 });
  }

  if (!body.titulo || !body.servicio || !body.descripcion) {
    return NextResponse.json({ ok: false, error: "Faltan título, servicio o descripción." }, { status: 400 });
  }

  const payload = normalizeMonthlyOffer({
    mes: month,
    mes_nombre: body.mes_nombre,
    titulo: body.titulo,
    servicio: body.servicio,
    descripcion: body.descripcion,
    descuento_percent: Number(body.descuento_percent || 0),
    accent: body.accent,
    activo: body.activo !== false
  });

  const { client, error: configError } = getSupabaseAdmin();

  if (!client) {
    const offers = ensureLocalOffers();
    const index = offers.findIndex((offer) => offer.mes === month);
    const nextOffer = {
      id: index >= 0 ? offers[index].id : createLocalId("oferta"),
      ...payload,
      created_at: index >= 0 ? offers[index].created_at : new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (index >= 0) offers[index] = nextOffer;
    else offers.push(nextOffer);

    return NextResponse.json({
      ok: true,
      mode: "local-fallback",
      warning: configError || localFallbackWarning,
      oferta: nextOffer
    });
  }

  const { data, error } = await client
    .from("ofertas_mensuales")
    .upsert({ ...payload, updated_at: new Date().toISOString() }, { onConflict: "mes" })
    .select()
    .single();

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, mode: "supabase", oferta: data });
}
