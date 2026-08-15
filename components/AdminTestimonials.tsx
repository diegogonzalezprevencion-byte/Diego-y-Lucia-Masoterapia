"use client";
import { useEffect, useMemo, useState } from "react";

type Testimonio = {
  id: string;
  nombre: string;
  edad?: string | number | null;
  servicio_realizado?: string | null;
  comentario: string;
  activo: boolean;
  created_at?: string;
};

type FormMode = "create" | "edit";

function formatDate(value?: string) {
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

export default function AdminTestimonials() {
  const [items, setItems] = useState<Testimonio[]>([]);
  const [mode, setMode] = useState<FormMode>("create");
  const [editingId, setEditingId] = useState("");
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [servicioRealizado, setServicioRealizado] = useState("");
  const [comentario, setComentario] = useState("");
  const [activo, setActivo] = useState(true);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (filter === "publicados") return item.activo;
      if (filter === "pendientes") return !item.activo;
      return true;
    });
  }, [items, filter]);

  function resetForm() {
    setMode("create");
    setEditingId("");
    setNombre("");
    setEdad("");
    setServicioRealizado("");
    setComentario("");
    setActivo(true);
  }

  async function load() {
    setLoading(true);
    setError("");
    const r = await fetch("/api/admin/testimonios", { cache: "no-store" });
    const d = await r.json();
    if (d.ok) setItems(d.testimonios || []);
    else setError(d.error || "No se pudieron cargar los testimonios.");
    setLoading(false);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const payload = {
      id: editingId,
      nombre,
      edad: edad ? Number(edad) : null,
      servicio_realizado: servicioRealizado,
      comentario,
      activo
    };

    const r = await fetch("/api/admin/testimonios", {
      method: mode === "edit" ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const d = await r.json();

    if (!d.ok) return setError(d.error || "Error al guardar testimonio.");

    setSuccess(mode === "edit" ? "Testimonio actualizado correctamente." : "Testimonio creado correctamente.");
    resetForm();
    await load();
  }

  function edit(item: Testimonio) {
    setMode("edit");
    setEditingId(item.id);
    setNombre(item.nombre || "");
    setEdad(item.edad ? String(item.edad) : "");
    setServicioRealizado(item.servicio_realizado || "");
    setComentario(item.comentario || "");
    setActivo(item.activo);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function toggle(id: string, activoValue: boolean) {
    setError("");
    setSuccess("");

    const r = await fetch("/api/admin/testimonios", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, activo: activoValue })
    });

    const d = await r.json();
    if (!d.ok) return setError(d.error || "No se pudo cambiar el estado.");

    setSuccess(activoValue ? "Testimonio aceptado y publicado." : "Testimonio ocultado.");
    await load();
  }

  async function remove(id: string) {
    const confirmed = window.confirm("¿Seguro que deseas eliminar este testimonio? Esta acción no se puede deshacer.");
    if (!confirmed) return;

    setError("");
    setSuccess("");

    const r = await fetch(`/api/admin/testimonios?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    const d = await r.json();

    if (!d.ok) return setError(d.error || "No se pudo eliminar el testimonio.");

    setSuccess("Testimonio eliminado correctamente.");
    if (editingId === id) resetForm();
    await load();
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="admin-testimonials-layout">
      <div className="card">
        <h2>{mode === "edit" ? "Modificar testimonio" : "Crear testimonio"}</h2>
        <p>
          Los testimonios visibles en la página pública son solo los que estén en estado publicado.
          Los enviados por clientes quedan pendientes hasta que el administrador los acepte.
        </p>

        <form className="form" onSubmit={save}>
          <input className="input" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          <input className="input" type="number" min="0" max="120" placeholder="Edad" value={edad} onChange={(e) => setEdad(e.target.value)} />
          <input className="input" placeholder="Servicio realizado" value={servicioRealizado} onChange={(e) => setServicioRealizado(e.target.value)} required />
          <textarea className="textarea" placeholder="Comentario de la persona" value={comentario} onChange={(e) => setComentario(e.target.value)} required />

          <label className="testimonial-admin-check">
            <input type="checkbox" checked={activo} onChange={(e) => setActivo(e.target.checked)} />
            Publicar en la página web
          </label>

          <div className="admin-actions compact-actions">
            <button className="btn">{mode === "edit" ? "Guardar cambios" : "Guardar testimonio"}</button>
            {mode === "edit" && <button className="btn gray" type="button" onClick={resetForm}>Cancelar edición</button>}
          </div>
        </form>

        {success && <div className="notice" style={{ marginTop: 16 }}><strong>{success}</strong></div>}
        {error && <div className="error" style={{ marginTop: 16 }}><strong>{error}</strong></div>}
      </div>

      <div className="card">
        <div className="admin-testimonials-header">
          <div>
            <h2>Repositorio de testimonios</h2>
            <p>Administra, acepta, modifica, oculta o elimina testimonios.</p>
          </div>
          <label className="label">
            Filtro
            <select className="select" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">Todos</option>
              <option value="pendientes">Pendientes</option>
              <option value="publicados">Publicados</option>
            </select>
          </label>
        </div>

        {loading && <p>Cargando testimonios...</p>}

        <div className="table-wrap reservations-compact-wrap">
          <table className="table reservations-compact-table testimonials-admin-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Persona</th>
                <th>Servicio</th>
                <th>Comentario</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td>{formatDate(item.created_at)}</td>
                  <td>
                    <strong>{item.nombre}</strong>
                    {item.edad ? <><br />{item.edad} años</> : null}
                  </td>
                  <td>{item.servicio_realizado || "Servicio no informado"}</td>
                  <td>{item.comentario}</td>
                  <td>
                    <span className={`status-pill ${item.activo ? "status-confirmada" : "status-pendiente"}`}>
                      {item.activo ? "Publicado" : "Pendiente"}
                    </span>
                  </td>
                  <td>
                    <div className="admin-actions compact-actions">
                      <button className="btn" onClick={() => toggle(item.id, true)} disabled={item.activo}>Aceptar</button>
                      <button className="btn gray" onClick={() => toggle(item.id, false)} disabled={!item.activo}>Ocultar</button>
                      <button className="btn secondary" onClick={() => edit(item)}>Modificar</button>
                      <button className="btn red" onClick={() => remove(item.id)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filteredItems.length === 0 && <tr><td colSpan={6}>No hay testimonios para este filtro.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
