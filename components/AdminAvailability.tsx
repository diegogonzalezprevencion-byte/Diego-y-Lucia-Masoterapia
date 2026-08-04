"use client";
import { useEffect, useState } from "react";

type Disponibilidad = { id: string; area: string; fecha: string; hora: string; disponible: boolean };

const hourlySlots = [
  "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
  "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"
];

export default function AdminAvailability() {
  const [items, setItems] = useState<Disponibilidad[]>([]);
  const [area, setArea] = useState("masoterapia");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("09:00");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [warning, setWarning] = useState("");
  const [savingFullDay, setSavingFullDay] = useState(false);

  async function load() {
    setError("");
    try {
      const response = await fetch("/api/admin/disponibilidad");
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "No se pudo cargar disponibilidad.");
      setItems(data.disponibilidad || []);
      setWarning(data.mode === "local-fallback" ? data.warning || "Modo temporal sin Supabase activo." : "");
    } catch (err: any) {
      setError(err.message || "No se pudo cargar disponibilidad.");
    }
  }

  async function create(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    const response = await fetch("/api/admin/disponibilidad", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ area, fecha, hora, disponible: true })
    });
    const data = await response.json();
    if (!response.ok || !data.ok) return setError(data.error || "No se pudo crear disponibilidad.");
    if (data.mode === "local-fallback") setWarning(data.warning || "Modo temporal sin Supabase activo.");
    setMessage("Disponibilidad guardada.");
    await load();
  }

  async function createFullDay() {
    if (!fecha) return setError("Primero debes seleccionar una fecha.");
    setError("");
    setMessage("");
    setSavingFullDay(true);
    try {
      for (const slot of hourlySlots) {
        const response = await fetch("/api/admin/disponibilidad", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ area, fecha, hora: slot, disponible: true })
        });
        const data = await response.json();
        if (!response.ok || !data.ok) throw new Error(data.error || `No se pudo crear el horario ${slot}.`);
        if (data.mode === "local-fallback") setWarning(data.warning || "Modo temporal sin Supabase activo.");
      }
      setMessage("Jornada completa guardada de 09:00 a 21:00, en bloques de 1 hora.");
      await load();
    } catch (err: any) {
      setError(err.message || "No se pudo crear la jornada completa.");
    } finally {
      setSavingFullDay(false);
    }
  }

  async function remove(id: string) {
    const response = await fetch(`/api/admin/disponibilidad?id=${id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok || !data.ok) return alert(data.error || "No se pudo eliminar.");
    await load();
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="grid-2">
      <div className="card">
        <h2>Crear disponibilidad</h2>
        <form className="form" onSubmit={create}>
          <label className="label">Área<select className="select" value={area} onChange={(e) => setArea(e.target.value)}><option value="masoterapia">Masoterapia</option></select></label>
          <label className="label">Fecha<input className="input" type="date" required value={fecha} onChange={(e) => setFecha(e.target.value)} /></label>
          <label className="label">Hora<select className="select" value={hora} onChange={(e) => setHora(e.target.value)}>{hourlySlots.map((slot) => <option value={slot} key={slot}>{slot}</option>)}</select></label>
          <button className="btn" type="submit">Guardar horario</button>
          <button className="btn secondary" type="button" onClick={createFullDay} disabled={savingFullDay}>{savingFullDay ? "Guardando jornada..." : "Crear jornada completa 09:00 a 21:00"}</button>
        </form>
        {message && <div className="notice" style={{ marginTop: 18 }}>{message}</div>}
        {warning && <div className="notice supabase-warning" style={{ marginTop: 18 }}><strong>Aviso:</strong> {warning}</div>}
        {error && <div className="error" style={{ marginTop: 18 }}>{error}</div>}
      </div>
      <div className="card">
        <h2>Horarios disponibles</h2>
        <div className="table-wrap"><table className="table"><thead><tr><th>Fecha</th><th>Hora</th><th>Área</th><th>Acción</th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td>{item.fecha}</td><td>{item.hora}</td><td>{item.area}</td><td><button className="btn red" onClick={() => remove(item.id)}>Eliminar</button></td></tr>)}{items.length === 0 && <tr><td colSpan={4}>No hay disponibilidad configurada.</td></tr>}</tbody></table></div>
      </div>
    </div>
  );
}
