"use client";
import { useEffect, useMemo, useState } from "react";

type Disponibilidad = { id: string; area: string; fecha: string; hora: string; disponible: boolean };

const hourlySlots = [
  "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
  "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"
];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function AdminAvailability() {
  const [items, setItems] = useState<Disponibilidad[]>([]);
  const [area, setArea] = useState("masoterapia");
  const [fecha, setFecha] = useState(todayISO());
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [warning, setWarning] = useState("");
  const [savingSlot, setSavingSlot] = useState<string | null>(null);
  const [savingFullDay, setSavingFullDay] = useState(false);

  const slotsByHour = useMemo(() => {
    return new Map(items.map((item) => [item.hora, item]));
  }, [items]);

  async function load(selectedArea = area, selectedFecha = fecha) {
    setError("");
    try {
      const params = new URLSearchParams({ area: selectedArea, fecha: selectedFecha });
      const response = await fetch(`/api/admin/disponibilidad?${params.toString()}`);
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "No se pudo cargar disponibilidad.");
      setItems(data.disponibilidad || []);
      setWarning(data.mode === "local-fallback" ? data.warning || "Modo temporal sin Supabase activo." : "");
    } catch (err: any) {
      setError(err.message || "No se pudo cargar disponibilidad.");
    }
  }

  async function updateSlot(slot: string, disponible: boolean) {
    if (!fecha) {
      setError("Primero debes seleccionar una fecha.");
      return;
    }

    setError("");
    setMessage("");
    setSavingSlot(slot);

    try {
      const response = await fetch("/api/admin/disponibilidad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ area, fecha, hora: slot, disponible })
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "No se pudo actualizar disponibilidad.");
      if (data.mode === "local-fallback") setWarning(data.warning || "Modo temporal sin Supabase activo.");
      setMessage(disponible ? `Horario ${slot} activado para clientes.` : `Horario ${slot} desactivado para clientes.`);
      await load();
    } catch (err: any) {
      setError(err.message || "No se pudo actualizar disponibilidad.");
    } finally {
      setSavingSlot(null);
    }
  }

  async function updateFullDay(disponible: boolean) {
    if (!fecha) {
      setError("Primero debes seleccionar una fecha.");
      return;
    }

    setError("");
    setMessage("");
    setSavingFullDay(true);

    try {
      for (const slot of hourlySlots) {
        const response = await fetch("/api/admin/disponibilidad", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ area, fecha, hora: slot, disponible })
        });
        const data = await response.json();
        if (!response.ok || !data.ok) throw new Error(data.error || `No se pudo actualizar el horario ${slot}.`);
        if (data.mode === "local-fallback") setWarning(data.warning || "Modo temporal sin Supabase activo.");
      }

      setMessage(disponible ? "Jornada completa activada de 09:00 a 21:00." : "Jornada completa desactivada de 09:00 a 21:00.");
      await load();
    } catch (err: any) {
      setError(err.message || "No se pudo actualizar la jornada completa.");
    } finally {
      setSavingFullDay(false);
    }
  }

  useEffect(() => {
    load(area, fecha);
  }, [area, fecha]);

  return (
    <div className="grid-2">
      <div className="card">
        <h2>Gestión por día</h2>
        <p>
          Selecciona una fecha y activa o desactiva cada bloque horario. Los horarios desactivados no aparecerán en la reserva pública.
        </p>
        <div className="form">
          <label className="label">
            Área
            <select className="select" value={area} onChange={(e) => setArea(e.target.value)}>
              <option value="masoterapia">Masoterapia</option>
            </select>
          </label>
          <label className="label">
            Fecha
            <input className="input" type="date" required value={fecha} onChange={(e) => setFecha(e.target.value)} />
          </label>
          <div className="admin-actions">
            <button className="btn" type="button" onClick={() => updateFullDay(true)} disabled={savingFullDay}>
              {savingFullDay ? "Guardando..." : "Activar jornada completa"}
            </button>
            <button className="btn red" type="button" onClick={() => updateFullDay(false)} disabled={savingFullDay}>
              {savingFullDay ? "Guardando..." : "Desactivar jornada completa"}
            </button>
          </div>
        </div>
        {message && <div className="notice" style={{ marginTop: 18 }}>{message}</div>}
        {warning && <div className="notice supabase-warning" style={{ marginTop: 18 }}><strong>Aviso:</strong> {warning}</div>}
        {error && <div className="error" style={{ marginTop: 18 }}>{error}</div>}
      </div>

      <div className="card">
        <h2>Horarios del día</h2>
        <p>
          Control directo de disponibilidad para el {fecha || "día seleccionado"}. Cada bloque dura 1 hora.
        </p>
        <div className="table-wrap">
          <table className="table availability-table">
            <thead>
              <tr>
                <th>Hora</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {hourlySlots.map((slot) => {
                const configuredSlot = slotsByHour.get(slot);
                const isActive = configuredSlot?.disponible === true;
                const isSaving = savingSlot === slot;

                return (
                  <tr key={slot} className={isActive ? "availability-row-active" : "availability-row-inactive"}>
                    <td><strong>{slot}</strong></td>
                    <td>
                      <span className={isActive ? "status-pill availability-active" : "status-pill availability-inactive"}>
                        {isActive ? "Activo" : "Desactivado"}
                      </span>
                    </td>
                    <td>
                      <button
                        className={isActive ? "btn red" : "btn"}
                        type="button"
                        onClick={() => updateSlot(slot, !isActive)}
                        disabled={isSaving || savingFullDay}
                      >
                        {isSaving ? "Guardando..." : isActive ? "Desactivar" : "Activar"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
