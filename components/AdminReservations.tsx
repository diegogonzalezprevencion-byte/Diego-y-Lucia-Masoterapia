"use client";
import { useEffect, useState } from "react";

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
};

export default function AdminReservations() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState("");

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
      {loading && <p>Cargando reservas...</p>}
      {success && <div className="notice" style={{ marginBottom: 16 }}><strong>{success}</strong></div>}
      {error && <div className="error" style={{ marginBottom: 16 }}><strong>{error}</strong></div>}

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
            {reservas.map((r) => (
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
            {!loading && reservas.length === 0 && <tr><td colSpan={7}>No hay reservas registradas.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
