"use client";

import { useEffect, useMemo, useState } from "react";
import { buildWhatsAppUrl } from "../lib/whatsapp";

type BookingFormProps = { type: "masoterapia"; title: string; services: string[]; };

function toISODate(date: Date) { return date.toISOString().slice(0, 10); }
function formatDayLabel(date: Date) { return new Intl.DateTimeFormat("es-CL", { weekday: "short" }).format(date).replace(".", ""); }
function formatMonthLabel(date: Date) { return new Intl.DateTimeFormat("es-CL", { month: "short" }).format(date).replace(".", ""); }

export default function BookingForm({ type, title, services }: BookingFormProps) {
  const [service, setService] = useState(services[0]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [error, setError] = useState("");

  const days = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 14 }).map((_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + index);
      return date;
    });
  }, []);

  useEffect(() => { if (!date && days.length > 0) setDate(toISODate(days[1] || days[0])); }, [date, days]);

  useEffect(() => {
    async function loadSlots() {
      setTime(""); setError(""); setSubmittedMessage(""); setWhatsappUrl("");
      if (!date) { setSlots([]); return; }
      setLoadingSlots(true);
      try {
        const response = await fetch(`/api/disponibilidad?area=${type}&fecha=${date}`);
        const data = await response.json();
        if (!response.ok || !data.ok) throw new Error(data.error || "No se pudo consultar disponibilidad.");
        setSlots(data.slots || []);
      } catch (err: any) {
        setError(err.message || "No se pudo consultar disponibilidad.");
      } finally {
        setLoadingSlots(false);
      }
    }
    loadSlots();
  }, [date, type]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(""); setSubmittedMessage(""); setWhatsappUrl("");
    if (!date || !time) { setError("Debes seleccionar fecha y hora."); return; }
    setSubmitting(true);
    try {
      const response = await fetch("/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ area: type, servicio: service, fecha: date, hora: time, nombre: name, email, telefono: phone })
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "No se pudo guardar la reserva.");
      const message = data.automation?.whatsappMessage || `Hola, soy ${name}. Solicité una reserva para ${type}: ${service}, el día ${date} a las ${time}.`;
      setWhatsappUrl(buildWhatsAppUrl(message));
      setSubmittedMessage("Reserva registrada correctamente. Se prepararon recordatorios de 24 horas y del mismo día.");
      setName(""); setEmail(""); setPhone(""); setTime("");
      setSlots((current) => current.filter((slot) => slot !== time));
    } catch (err: any) {
      setError(err.message || "No se pudo registrar la reserva.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="calendar-layout">
      <div className="card calendar-panel">
        <div><h2>{title}</h2><p>Elige el servicio, selecciona un día disponible y luego una hora.</p></div>
        <label className="label">Servicio<select className="select" value={service} onChange={(e) => setService(e.target.value)}>{services.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        <div><strong>Selecciona un día</strong><div className="day-strip" style={{ marginTop: 12 }}>{days.map((day) => { const iso = toISODate(day); const active = date === iso; return <button className={active ? "day-card active" : "day-card"} type="button" key={iso} onClick={() => setDate(iso)}><small>{formatDayLabel(day)}</small><strong>{day.getDate()}</strong><small>{formatMonthLabel(day)}</small></button>; })}</div></div>
        <div><strong>Horarios disponibles</strong>{loadingSlots && <p>Cargando horarios...</p>}{!loadingSlots && date && slots.length === 0 && <p>No hay horarios disponibles para esta fecha.</p>}<div className="slot-grid" style={{ marginTop: 12 }}>{slots.map((slot) => <button type="button" className={time === slot ? "slot active" : "slot"} key={slot} onClick={() => setTime(slot)}>{slot}</button>)}</div></div>
        <div className="summary-box"><strong>Resumen</strong><p style={{ marginBottom: 0 }}>Servicio: {service}<br />Fecha: {date || "No seleccionada"}<br />Hora: {time || "No seleccionada"}<br />Recordatorios: 24 horas antes y el mismo día</p></div>
      </div>
      <div className="card">
        <h2>Datos de contacto</h2>
        <form className="form" onSubmit={handleSubmit}>
          <label className="label">Nombre completo<input className="input" required value={name} onChange={(e) => setName(e.target.value)} /></label>
          <label className="label">Correo<input className="input" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          <label className="label">Teléfono / WhatsApp<input className="input" required value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
          <button className="btn" type="submit" disabled={submitting}>{submitting ? "Guardando..." : "Solicitar reserva"}</button>
        </form>
        {submittedMessage && <div className="notice" style={{ marginTop: 18 }}><strong>{submittedMessage}</strong>{whatsappUrl && <p style={{ marginBottom: 0 }}><a className="btn whatsapp" href={whatsappUrl} target="_blank" rel="noopener noreferrer">Confirmar por WhatsApp</a></p>}</div>}
        {error && <div className="error" style={{ marginTop: 18 }}><strong>{error}</strong></div>}
      </div>
    </div>
  );
}
