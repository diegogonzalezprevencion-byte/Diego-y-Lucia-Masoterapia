"use client";
import { useEffect, useState } from "react";

type Contacto = {
  id: string;
  nombre: string;
  email: string;
  telefono?: string | null;
  mensaje: string;
  origen?: string | null;
  revisado?: boolean;
  created_at?: string;
};

function formatDateTime(value?: string) {
  if (!value) return "Sin fecha";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

export default function AdminContacts() {
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState("");

  async function loadContactos() {
    setLoading(true);
    setError("");
    try {
      const r = await fetch(`/api/admin/contactos?estado=${encodeURIComponent(filter)}`, { cache: "no-store" });
      const d = await r.json();
      if (!r.ok || !d.ok) throw new Error(d.error || "No se pudieron cargar los contactos.");
      setContactos(d.contactos || []);
    } catch (err: any) {
      setError(err.message || "No se pudieron cargar los contactos.");
    } finally {
      setLoading(false);
    }
  }

  async function updateReviewed(id: string, revisado: boolean) {
    setUpdating(id);
    setError("");
    setSuccess("");

    try {
      const r = await fetch(`/api/admin/contactos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ revisado })
      });
      const d = await r.json();

      if (!r.ok || !d.ok) throw new Error(d.error || "No se pudo actualizar el contacto.");

      setSuccess(revisado ? "Formulario marcado como revisado." : "Formulario marcado como no revisado.");
      await loadContactos();
    } catch (err: any) {
      setError(err.message || "No se pudo actualizar el contacto.");
    } finally {
      setUpdating("");
    }
  }

  useEffect(() => { loadContactos(); }, [filter]);

  return (
    <div className="card">
      <h2>Formularios de contacto</h2>
      <p>Repositorio de mensajes enviados desde la sección Contacto de la página web.</p>

      <label className="label admin-filter">
        Filtro
        <select className="select" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Todos</option>
          <option value="no-revisado">No revisados</option>
          <option value="revisado">Revisados</option>
        </select>
      </label>

      {loading && <p>Cargando formularios...</p>}
      {success && <div className="notice" style={{ marginBottom: 16 }}><strong>{success}</strong></div>}
      {error && <div className="error" style={{ marginBottom: 16 }}><strong>{error}</strong></div>}

      <div className="table-wrap admin-contacts-wrap">
        <table className="table admin-contacts-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Contacto</th>
              <th>Mensaje</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {contactos.map((contacto) => (
              <tr key={contacto.id}>
                <td>{formatDateTime(contacto.created_at)}</td>
                <td>{contacto.nombre}</td>
                <td>{contacto.email}<br />{contacto.telefono || "Sin teléfono"}</td>
                <td>{contacto.mensaje}</td>
                <td>
                  <span className={`status-pill ${contacto.revisado ? "status-confirmada" : "status-pendiente"}`}>
                    {contacto.revisado ? "Revisado" : "No revisado"}
                  </span>
                </td>
                <td>
                  <div className="admin-actions compact-actions">
                    <button
                      className="btn"
                      disabled={!!updating || contacto.revisado}
                      onClick={() => updateReviewed(contacto.id, true)}
                    >
                      {updating === contacto.id ? "Actualizando..." : "Revisado"}
                    </button>
                    <button
                      className="btn gray"
                      disabled={!!updating || !contacto.revisado}
                      onClick={() => updateReviewed(contacto.id, false)}
                    >
                      No revisado
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && contactos.length === 0 && <tr><td colSpan={6}>No hay formularios de contacto.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
