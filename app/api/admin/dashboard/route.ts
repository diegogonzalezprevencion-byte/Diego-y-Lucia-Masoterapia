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

function normalizeDate(value: string | null) {
  if (!value) return "";
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : "";
}

function getDefaultFromDate() {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return iso(date);
}

function getDefaultToDate() {
  return iso(new Date());
}

function safeLabel(value: any, fallback = "Sin dato") {
  const clean = String(value || "").replace(/\s+/g, " ").trim();
  return clean || fallback;
}

function groupTop(rows: any[], getKey: (row: any) => string, limit = 8) {
  const counts = new Map<string, number>();

  rows.forEach((row) => {
    const key = getKey(row);
    counts.set(key, (counts.get(key) || 0) + 1);
  });

  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

function buildAnalytics(rows: any[], filters: Record<string, string>, warning = "") {
  const pageViews = rows.filter((row) => row.event_type === "page_view");
  const clicks = rows.filter((row) => row.event_type === "click");
  const visitors = new Set(rows.map((row) => row.visitor_id || row.session_id).filter(Boolean));
  const sessions = new Set(rows.map((row) => row.session_id).filter(Boolean));

  const byDay = groupTop(
    pageViews,
    (row) => String(row.created_at || "").slice(0, 10) || "Sin fecha",
    60
  ).sort((a, b) => a.label.localeCompare(b.label));

  const topPages = groupTop(pageViews, (row) => safeLabel(row.path, "Página sin ruta"), 10);
  const topClicks = groupTop(
    clicks,
    (row) => safeLabel(row.element_text || row.element_href || row.element_tag, "Click sin texto"),
    12
  );

  const topReferrers = groupTop(
    pageViews,
    (row) => {
      const utm = [row.utm_source, row.utm_medium].filter(Boolean).join(" / ");
      if (utm) return `Campaña: ${utm}`;
      if (row.referrer) {
        try {
          return new URL(row.referrer).hostname;
        } catch {
          return safeLabel(row.referrer, "Referencia externa");
        }
      }
      return "Directo / sin referencia";
    },
    8
  );

  const availablePaths = [...new Set(rows.map((row) => row.path).filter(Boolean))]
    .sort((a, b) => String(a).localeCompare(String(b)))
    .slice(0, 80);

  const recentEvents = rows.slice(0, 25).map((row) => ({
    id: row.id,
    event_type: row.event_type,
    created_at: row.created_at,
    path: row.path,
    element_text: row.element_text,
    element_href: row.element_href,
    referrer: row.referrer,
    visitor_id: row.visitor_id
  }));

  return {
    warning,
    filters,
    totalEvents: rows.length,
    pageViews: pageViews.length,
    clicks: clicks.length,
    uniqueVisitors: visitors.size,
    sessions: sessions.size,
    clickRate: pageViews.length > 0 ? Number(((clicks.length / pageViews.length) * 100).toFixed(1)) : 0,
    topPages,
    topClicks,
    topReferrers,
    byDay,
    availablePaths,
    recentEvents
  };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const filters = {
    from: normalizeDate(url.searchParams.get("from")) || getDefaultFromDate(),
    to: normalizeDate(url.searchParams.get("to")) || getDefaultToDate(),
    eventType: url.searchParams.get("eventType") || "todos",
    path: url.searchParams.get("path") || ""
  };

  const { client, error: configError } = getSupabaseAdmin();

  if (!client) {
    const store = getLocalStore();
    return NextResponse.json({
      ok: true,
      mode: "local-fallback",
      warning: configError || localFallbackWarning,
      ...buildDashboard(store.reservas),
      analytics: buildAnalytics([], filters, "Analítica no persistente porque Supabase no está configurado.")
    });
  }

  const { data: reservas, error } = await client.from("reservas").select("*");
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  let analyticsRows: any[] = [];
  let analyticsWarning = "";

  try {
    let analyticsQuery = client
      .from("analytics_events")
      .select("*")
      .gte("created_at", `${filters.from}T00:00:00.000Z`)
      .lte("created_at", `${filters.to}T23:59:59.999Z`)
      .order("created_at", { ascending: false })
      .limit(8000);

    if (filters.eventType && filters.eventType !== "todos") {
      analyticsQuery = analyticsQuery.eq("event_type", filters.eventType);
    }

    if (filters.path) {
      analyticsQuery = analyticsQuery.ilike("path", `%${filters.path}%`);
    }

    const { data: analyticsData, error: analyticsError } = await analyticsQuery;

    if (analyticsError) {
      analyticsWarning = `No se pudo cargar la analítica: ${analyticsError.message}`;
    } else {
      analyticsRows = analyticsData || [];
    }
  } catch (err: any) {
    analyticsWarning = err?.message || "No se pudo cargar la analítica.";
  }

  return NextResponse.json({
    ok: true,
    mode: "supabase",
    ...buildDashboard(reservas || []),
    analytics: buildAnalytics(analyticsRows, filters, analyticsWarning)
  });
}
