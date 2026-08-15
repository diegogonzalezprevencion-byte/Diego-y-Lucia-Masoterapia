"use client";
import { useEffect, useMemo, useState } from "react";

type Reserva = {
  id: string;
  area: string;
  servicio: string;
  fecha: string;
  hora: string;
  nombre: string;
  email: string;
  telefono: string;
  sucursal?: string;
  masoterapeuta?: string;
  comentarios?: string | null;
  estado: string;
  created_at?: string;
};

type ReservationFilters = {
  fechaHora: string;
  servicio: string;
  sucursal: string;
  masoterapeuta: string;
  cliente: string;
  comentarios: string;
  estado: string;
};

const initialFilters: ReservationFilters = {
  fechaHora: "",
  servicio: "",
  sucursal: "",
  masoterapeuta: "",
  cliente: "",
  comentarios: "",
  estado: "all"
};

function includesText(value: string | undefined | null, filter: string) {
  return (value || "").toLowerCase().includes(filter.toLowerCase().trim());
}

function getReservationTimestamp(reserva: Reserva) {
  if (reserva.created_at) {
    const created = new Date(reserva.created_at).getTime();
    if (!Number.isNaN(created)) return created;
  }

  const dateTime = new Date(`${reserva.fecha}T${reserva.hora || "00:00"}`).getTime();
  return Number.isNaN(dateTime) ? 0 : dateTime;
}

export default function AdminReservations() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [filters, setFilters] = useState<ReservationFilters>(initialFilters);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState("");

  const filteredReservas = useMemo(() => {
    return [...reservas]
      .sort((a, b) => getReservationTimestamp(b) - getReservationTimestamp(a))
      .filter((r) => {
        const fechaHora = `${r.fecha} ${r.hora}`;
        const cliente = `${r.nombre} ${r.email} ${r.telefono}`;

        return (
          includesText(fechaHora, filters.fechaHora) &&
          includesText(`${r.servicio} ${r.area}`, filters.servicio) &&
          includesText(r.sucursal || "Santiago Centro", filters.sucursal) &&
          includesText(r.masoterapeuta || "Diego González", filters.masoterapeuta) &&
          includesText(cliente, filters.cliente) &&
          includesText(r.comentarios || "Sin comentarios", filters.comentarios) &&
          (filters.estado === "all" || r.estado === filters.estado)
        );
      });
  }, [reservas, filters]);

  function updateFilter(key: keyof ReservationFilters, value: string) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  async function loadReservas() {
    setLoading(true);
    setError("");
    try {
      const r = await fetch("/api/reservas", { cache: "no-store" });
      const d = await r.json();
      if (!r.ok || !d.ok) throw new Error(d.error || "No se pudieron cargar las reservas.");
      setReservas(d.reservas || []);
    } catch (err: any) {
      setError(err.message || "No se pudieron cargar las reservas.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, estado: string) {
    setUpdating(`${id}-${estado}`);
    setError("");
    setSuccess("");

    try {
      const r = await fetch(`/api/reservas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado })
      });
      const d = await r.json();

      if (!r.ok || !d.ok) throw new Error(d.error || "No se pudo actualizar la reserva.");

      const emailStatus = d.emailConfirmation;
      if (estado === "confirmada") {
        if (emailStatus?.sent) setSuccess("Reserva confirmada y correo de confirmación enviado al cliente.");
        else if (emailStatus?.skipped) setSuccess(`Reserva confirmada. Correo no enviado: ${emailStatus.reason}`);
        else if (emailStatus?.error) setSuccess(`Reserva confirmada, pero no se pudo enviar el correo: ${emailStatus.error}`);
        else setSuccess("Reserva confirmada.");
      } else if (estado === "pendiente") {
        setSuccess("Reserva marcada como pendiente.");
      } else if (estado === "cancelada") {
        setSuccess("Reserva cancelada.");
      }

      await loadReservas();
    } catch (err: any) {
      setError(err.message || "No se pudo actualizar la reserva.");
    } finally {
      setUpdating("");
    }
  }

  useEffect(() => { loadReservas(); }, []);

  return (
    <div className="card admin-reservations-card">
      <h2>Reservas registradas</h2>
      <p>Ordenadas desde la reserva más nueva a la más antigua.</p>
      {loading && <p>Cargando reservas...</p>}
      {success && <div className="notice" style={{ marginBottom: 16 }}><strong>{success}</strong></div>}
      {error && <div className="error" style={{ marginBottom: 16 }}><strong>{error}</strong></div>}

      <div className="admin-table-filter-grid">
        <label>
          Fecha / Hora
          <input value={filters.fechaHora} onChange={(e) => updateFilter("fechaHora", e.target.value)} placeholder="Ej: 2026-08 o 10:00" />
        </label>
        <label>
          Servicio
          <input value={filters.servicio} onChange={(e) => updateFilter("servicio", e.target.value)} placeholder="Servicio" />
        </label>
        <label>
          Sucursal
          <input value={filters.sucursal} onChange={(e) => updateFilter("sucursal", e.target.value)} placeholder="Sucursal" />
        </label>
        <label>
          Masoterapeuta
          <input value={filters.masoterapeuta} onChange={(e) => updateFilter("masoterapeuta", e.target.value)} placeholder="Masoterapeuta" />
        </label>
        <label>
          Cliente / Contacto
          <input value={filters.cliente} onChange={(e) => updateFilter("cliente", e.target.value)} placeholder="Nombre, correo o teléfono" />
        </label>
        <label>
          Comentarios
          <input value={filters.comentarios} onChange={(e) => updateFilter("comentarios", e.target.value)} placeholder="Comentario" />
        </label>
        <label>
          Estado
          <select value={filters.estado} onChange={(e) => updateFilter("estado", e.target.value)}>
            <option value="all">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="confirmada">Confirmada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </label>
        <button className="btn gray" type="button" onClick={() => setFilters(initialFilters)}>Limpiar filtros</button>
      </div>

      <div className="table-wrap reservations-compact-wrap">
        <table className="table reservations-compact-table">
          <thead>
            <tr>
              <th>Fecha / Hora</th>
              <th>Servicio</th>
              <th>Sucursal</th>
              <th>Masoterapeuta</th>
              <th>Cliente / Contacto</th>
              <th>Comentarios</th>
              <th>Estado / Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservas.map((r) => (
              <tr key={r.id}>
                <td><strong>{r.fecha}</strong><br />{r.hora}</td>
                <td>{r.servicio}<br /><small>{r.area}</small></td>
                <td>{r.sucursal || "Santiago Centro"}</td>
                <td>{r.masoterapeuta || "Diego González"}</td>
                <td><strong>{r.nombre}</strong><br />{r.email}<br />{r.telefono}</td>
                <td>{r.comentarios?.trim() ? r.comentarios : "Sin comentarios"}</td>
                <td>
                  <span className={`status-pill status-${r.estado}`}>{r.estado}</span>
                  <div className="admin-actions compact-actions">
                    <button className="btn" onClick={() => updateStatus(r.id, "confirmada")} disabled={!!updating || r.estado === "confirmada"}>
                      {updating === `${r.id}-confirmada` ? "..." : "Confirmar"}
                    </button>
                    <button className="btn gray" onClick={() => updateStatus(r.id, "pendiente")} disabled={!!updating || r.estado === "pendiente"}>
                      {updating === `${r.id}-pendiente` ? "..." : "Pendiente"}
                    </button>
                    <button className="btn red" onClick={() => updateStatus(r.id, "cancelada")} disabled={!!updating || r.estado === "cancelada"}>
                      {updating === `${r.id}-cancelada` ? "..." : "Cancelar"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && filteredReservas.length === 0 && <tr><td colSpan={7}>No hay reservas que coincidan con los filtros.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
