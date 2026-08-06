"use client";
import { useEffect, useState } from "react";

type Testimonio = {
  id: string;
  nombre: string;
  edad?: string | number | null;
  servicio_realizado?: string | null;
  comentario: string;
  activo: boolean;
};

export default function AdminTestimonials() {
  const [items, setItems] = useState<Testimonio[]>([]);
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [servicioRealizado, setServicioRealizado] = useState("");
  const [comentario, setComentario] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const r = await fetch("/api/admin/testimonios", { cache: "no-store" });
    const d = await r.json();
    if (d.ok) setItems(d.testimonios || []);
    else setError(d.error);
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const r = await fetch("/api/admin/testimonios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre,
        edad: edad ? Number(edad) : null,
        servicio_realizado: servicioRealizado,
        comentario,
        activo: true
      })
    });

    const d = await r.json();

    if (!d.ok) return setError(d.error || "Error al guardar testimonio.");

    setNombre("");
    setEdad("");
    setServicioRealizado("");
    setComentario("");
    await load();
  }

  async function toggle(id: string, activo: boolean) {
    await fetch("/api/admin/testimonios", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, activo })
    });
    await load();
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="grid-2">
      <div className="card">
        <h2>Crear testimonio</h2>
        <p>Registra solo los datos necesarios: comentario, nombre, edad y servicio realizado.</p>
        <form className="form" onSubmit={create}>
          <input className="input" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          <input className="input" type="number" min="0" placeholder="Edad" value={edad} onChange={(e) => setEdad(e.target.value)} />
          <input className="input" placeholder="Servicio realizado" value={servicioRealizado} onChange={(e) => setServicioRealizado(e.target.value)} required />
          <textarea className="textarea" placeholder="Comentario de la persona" value={comentario} onChange={(e) => setComentario(e.target.value)} required />
          <button className="btn">Guardar</button>
        </form>
        {error && <div className="error">{error}</div>}
      </div>

      <div className="card">
        <h2>Testimonios</h2>
        <div className="table-wrap">
          <table className="table">
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.nombre}</strong>
                    {item.edad ? ` · ${item.edad} años` : ""}<br />
                    <small>{item.servicio_realizado || "Servicio no informado"} · {item.activo ? "Activo" : "Oculto"}</small><br />
                    {item.comentario}
                  </td>
                  <td>
                    <button className="btn gray" onClick={() => toggle(item.id, !item.activo)}>
                      {item.activo ? "Ocultar" : "Activar"}
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && <tr><td>No hay testimonios registrados.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
