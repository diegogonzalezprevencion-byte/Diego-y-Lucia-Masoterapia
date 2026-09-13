"use client";

import { useEffect, useMemo, useState } from "react";

type DashboardData = {
  ok: boolean;
  today: number;
  week: number;
  month: number;
  total: number;
  services: Array<{ servicio: string; count: number }>;
  analytics?: {
    warning?: string;
    filters: { from: string; to: string; eventType: string; path: string };
    totalEvents: number;
    pageViews: number;
    clicks: number;
    uniqueVisitors: number;
    sessions: number;
    clickRate: number;
    topPages: Array<{ label: string; count: number }>;
    topClicks: Array<{ label: string; count: number }>;
    topReferrers: Array<{ label: string; count: number }>;
    byDay: Array<{ label: string; count: number }>;
    availablePaths: string[];
    recentEvents: Array<any>;
  };
};

function toInputDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function defaultFilters() {
  const today = new Date();
  const from = new Date();
  from.setDate(today.getDate() - 30);

  return {
    from: toInputDate(from),
    to: toInputDate(today),
    eventType: "todos",
    path: ""
  };
}

function formatEventType(value: string) {
  if (value === "page_view") return "Visita";
  if (value === "click") return "Click";
  return value || "Evento";
}

function formatDateTime(value: string) {
  if (!value) return "Sin fecha";

  try {
    return new Intl.DateTimeFormat("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function shortText(value: string, max = 70) {
  if (!value) return "Sin dato";
  return value.length > max ? `${value.slice(0, max)}...` : value;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState(defaultFilters);

  const analytics = data?.analytics;

  const maxDailyViews = useMemo(() => {
    if (!analytics?.byDay?.length) return 1;
    return Math.max(...analytics.byDay.map((item) => item.count), 1);
  }, [analytics]);

  async function loadDashboard(nextFilters = filters) {
    setLoading(true);
    setError("");

    const params = new URLSearchParams({
      from: nextFilters.from,
      to: nextFilters.to,
      eventType: nextFilters.eventType,
      path: nextFilters.path
    });

    try {
      const response = await fetch(`/api/admin/dashboard?${params.toString()}`, { cache: "no-store" });
      const payload = await response.json();

      if (!response.ok || !payload.ok) throw new Error(payload.error || "No se pudo cargar el dashboard.");
      setData(payload);
    } catch (err: any) {
      setError(err.message || "Error al cargar dashboard.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard(defaultFilters());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) return <div className="error">{error}</div>;
  if (!data) return <p>Cargando métricas...</p>;

  return (
    <div className="admin-dashboard-page">
      <div className="grid-4">
        <div className="kpi"><strong>{data.today}</strong><span>Reservas hoy</span></div>
        <div className="kpi"><strong>{data.week}</strong><span>Reservas semana</span></div>
        <div className="kpi"><strong>{data.month}</strong><span>Reservas mes</span></div>
        <div className="kpi"><strong>{data.total}</strong><span>Total reservas</span></div>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <h2>Servicios más solicitados</h2>
        <div className="table-wrap">
          <table className="table">
            <tbody>
              {data.services.map((service) => (
                <tr key={service.servicio}>
                  <td>{service.servicio}</td>
                  <td>{service.count}</td>
                </tr>
              ))}
              {data.services.length === 0 && <tr><td>No hay reservas registradas.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <section className="dashboard-analytics-section card">
        <div className="dashboard-section-header">
          <div>
            <div className="eyebrow">Analítica web</div>
            <h2>Visitas, clics y eficiencia de la página</h2>
            <p>
              Revisa cuántos visitantes ingresan, qué páginas ven, en qué botones hacen clic y desde dónde llegan.
              Los visitantes son navegadores/dispositivos únicos, no personas identificadas por nombre.
            </p>
          </div>
          <button className="btn secondary" type="button" onClick={() => loadDashboard()} disabled={loading}>
            {loading ? "Actualizando..." : "Actualizar"}
          </button>
        </div>

        <form
          className="analytics-filter-grid"
          onSubmit={(event) => {
            event.preventDefault();
            loadDashboard(filters);
          }}
        >
          <label className="label">
            Desde
            <input className="input" type="date" value={filters.from} onChange={(e) => setFilters((current) => ({ ...current, from: e.target.value }))} />
          </label>
          <label className="label">
            Hasta
            <input className="input" type="date" value={filters.to} onChange={(e) => setFilters((current) => ({ ...current, to: e.target.value }))} />
          </label>
          <label className="label">
            Tipo de evento
            <select className="select" value={filters.eventType} onChange={(e) => setFilters((current) => ({ ...current, eventType: e.target.value }))}>
              <option value="todos">Todos</option>
              <option value="page_view">Solo visitas</option>
              <option value="click">Solo clics</option>
            </select>
          </label>
          <label className="label">
            Ruta / página
            <input className="input" placeholder="Ej: /, /contacto, /agenda" value={filters.path} onChange={(e) => setFilters((current) => ({ ...current, path: e.target.value }))} />
          </label>
          <div className="analytics-filter-actions">
            <button className="btn" type="submit" disabled={loading}>Filtrar</button>
            <button
              className="btn gray"
              type="button"
              onClick={() => {
                const reset = defaultFilters();
                setFilters(reset);
                loadDashboard(reset);
              }}
              disabled={loading}
            >
              Limpiar
            </button>
          </div>
        </form>

        {analytics?.warning && <div className="notice dashboard-warning"><strong>{analytics.warning}</strong></div>}

        <div className="grid-4 analytics-kpis">
          <div className="kpi"><strong>{analytics?.uniqueVisitors ?? 0}</strong><span>Visitantes únicos</span></div>
          <div className="kpi"><strong>{analytics?.pageViews ?? 0}</strong><span>Vistas de página</span></div>
          <div className="kpi"><strong>{analytics?.clicks ?? 0}</strong><span>Clics registrados</span></div>
          <div className="kpi"><strong>{analytics?.clickRate ?? 0}%</strong><span>Clics por visita</span></div>
        </div>

        <div className="analytics-summary-line">
          <span>Total eventos: <strong>{analytics?.totalEvents ?? 0}</strong></span>
          <span>Sesiones: <strong>{analytics?.sessions ?? 0}</strong></span>
          <span>Periodo: <strong>{filters.from}</strong> al <strong>{filters.to}</strong></span>
        </div>

        <div className="analytics-grid-2">
          <div className="analytics-panel">
            <h3>Páginas más visitadas</h3>
            <div className="table-wrap">
              <table className="table analytics-table">
                <tbody>
                  {analytics?.topPages?.map((item) => (
                    <tr key={item.label}><td>{item.label}</td><td>{item.count}</td></tr>
                  ))}
                  {(!analytics?.topPages || analytics.topPages.length === 0) && <tr><td>Sin visitas registradas para el filtro seleccionado.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          <div className="analytics-panel">
            <h3>Clics más frecuentes</h3>
            <div className="table-wrap">
              <table className="table analytics-table">
                <tbody>
                  {analytics?.topClicks?.map((item) => (
                    <tr key={item.label}><td>{item.label}</td><td>{item.count}</td></tr>
                  ))}
                  {(!analytics?.topClicks || analytics.topClicks.length === 0) && <tr><td>Sin clics registrados para el filtro seleccionado.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="analytics-grid-2">
          <div className="analytics-panel">
            <h3>Origen del tráfico</h3>
            <div className="table-wrap">
              <table className="table analytics-table">
                <tbody>
                  {analytics?.topReferrers?.map((item) => (
                    <tr key={item.label}><td>{item.label}</td><td>{item.count}</td></tr>
                  ))}
                  {(!analytics?.topReferrers || analytics.topReferrers.length === 0) && <tr><td>Sin origen registrado.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          <div className="analytics-panel">
            <h3>Visitas por día</h3>
            <div className="daily-bars">
              {analytics?.byDay?.slice(-14).map((item) => (
                <div className="daily-bar-row" key={item.label}>
                  <span>{item.label}</span>
                  <div><i style={{ width: `${Math.max((item.count / maxDailyViews) * 100, 6)}%` }}></i></div>
                  <strong>{item.count}</strong>
                </div>
              ))}
              {(!analytics?.byDay || analytics.byDay.length === 0) && <p>No hay visitas por día en este filtro.</p>}
            </div>
          </div>
        </div>

        <div className="analytics-panel">
          <h3>Últimos eventos registrados</h3>
          <div className="table-wrap">
            <table className="table analytics-events-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Evento</th>
                  <th>Página</th>
                  <th>Detalle</th>
                </tr>
              </thead>
              <tbody>
                {analytics?.recentEvents?.map((event) => (
                  <tr key={event.id}>
                    <td>{formatDateTime(event.created_at)}</td>
                    <td>{formatEventType(event.event_type)}</td>
                    <td>{event.path || "Sin ruta"}</td>
                    <td>{shortText(event.element_text || event.referrer || event.element_href || "Visita registrada", 90)}</td>
                  </tr>
                ))}
                {(!analytics?.recentEvents || analytics.recentEvents.length === 0) && <tr><td colSpan={4}>Sin eventos registrados.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
