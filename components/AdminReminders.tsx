"use client";
import { useEffect, useState } from "react";
import { buildWhatsAppUrlForNumber, formatDateForClient } from "../lib/whatsapp";

type Reminder = {
  id: string;
  area: string;
  servicio: string;
  fecha: string;
  hora: string;
  sucursal?: string;
  masoterapeuta?: string;
  nombre: string;
  telefono: string;
  email: string;
  reminderType: string;
  reminderMessage: string;
};

const therapists = ["Diego González", "Lucia Lorca"];

export default function AdminReminders() {
  const [items, setItems] = useState<Reminder[]>([]);
  const [filter, setFilter] = useState("all");
  const [therapistFilter, setTherapistFilter] = useState("all");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ type: filter, masoterapeuta: therapistFilter });
      const r = await fetch(`/api/admin/recordatorios?${params.toString()}`, { cache: "no-store" });
      const d = await r.json();
      if (!r.ok || !d.ok) throw new Error(d.error || "No se pudieron cargar recordatorios.");
      setItems(d.reminders || []);
    } catch (err: any) {
      setError(err.message || "No se pudieron cargar recordatorios.");
    } finally {
      setLoading(false);
    }
  }

  async function markSent(id: string, type: string) {
    const normalized = type === "same_day" ? "same_day" : "24h";
    const r = await fetch("/api/admin/recordatorios", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, type: normalized })
    });
    const d = await r.json();
    if (!r.ok || !d.ok) return alert(d.error || "No se pudo marcar como enviado.");
    await load();
  }

  useEffect(() => { load(); }, [filter, therapistFilter]);

  return (
    <div className="card">
      <h2>Recordatorios pendientes</h2>
      <p>Esta vista prepara mensajes para WhatsApp del cliente y permite marcar recordatorios como enviados.</p>

      <div className="admin-filter-row">
        <label className="label">
          Filtro
          <select className="select" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">Todos</option>
            <option value="24h">Pendientes 24 horas antes</option>
            <option value="same_day">Pendientes mismo día</option>
          </select>
        </label>

        <label className="label">
          Masoterapeuta
          <select className="select" value={therapistFilter} onChange={(e) => setTherapistFilter(e.target.value)}>
            <option value="all">Todos</option>
            {therapists.map((therapist) => <option key={therapist} value={therapist}>{therapist}</option>)}
          </select>
        </label>
      </div>

      {loading && <p>Cargando...</p>}
      {error && <div className="error">{error}</div>}

      <div className="table-wrap reservations-compact-wrap reminders-compact-wrap" style={{ marginTop: 18 }}>
        <table className="table reservations-compact-table reminders-table">
          <thead>
            <tr>
              <th>Reserva</th>
              <th>Masoterapeuta</th>
              <th>Cliente</th>
              <th>Mensaje</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id + item.reminderType}>
                <td>
                  {formatDateForClient(item.fecha)}<br />{item.hora}<br />{item.sucursal || item.area}
                </td>
                <td>{item.masoterapeuta || "Diego González"}</td>
                <td>{item.nombre}<br />{item.email}<br />{item.telefono}</td>
                <td>{item.reminderMessage}</td>
                <td>
                  <div className="admin-actions compact-actions reminder-actions">
                    <a className="btn whatsapp reminder-whatsapp-btn" href={buildWhatsAppUrlForNumber(item.telefono, item.reminderMessage)} target="_blank" rel="noopener noreferrer">
                      WhatsApp
                    </a>
                    {(item.reminderType === "24h" || item.reminderType === "same_day") && (
                      <button className="btn gray reminder-mark-btn" onClick={() => markSent(item.id, item.reminderType)}>
                        Marcar enviado
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {!loading && items.length === 0 && <tr><td colSpan={5}>No hay recordatorios pendientes.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
