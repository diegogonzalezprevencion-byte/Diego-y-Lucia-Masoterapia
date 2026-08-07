"use client";

import { useEffect, useMemo, useState } from "react";
import { buildWhatsAppUrl } from "../lib/whatsapp";

type BookingFormProps = { type: "masoterapia"; title: string; services: string[]; };

const branches = ["Santiago Centro", "Comuna de San Miguel"];
const therapists = ["Diego González", "Lucia Lorca"];

function toISODate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDayLabel(date: Date) {
  return new Intl.DateTimeFormat("es-CL", { weekday: "short" }).format(date).replace(".", "");
}

function formatMonthLabel(date: Date) {
  return new Intl.DateTimeFormat("es-CL", { month: "short" }).format(date).replace(".", "");
}

const AUGUST_DISCOUNT_PERCENT = 20;

type AugustPricing = {
  isAugust: boolean;
  originalPrice: number | null;
  discountAmount: number | null;
  finalPrice: number | null;
};

function extractPriceCLP(service: string) {
  const match = service.match(/\$\s*([\d.]+)/);
  if (!match) return null;
  const numericValue = Number(match[1].replace(/\./g, ""));
  return Number.isFinite(numericValue) ? numericValue : null;
}

function formatCLP(value: number | null) {
  if (value === null) return "Consultar";
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0
  }).format(value);
}

function getAugustPricing(service: string, date: string): AugustPricing {
  const isAugust = Boolean(date && date.slice(5, 7) === "08");
  const originalPrice = extractPriceCLP(service);

  if (!isAugust || originalPrice === null) {
    return {
      isAugust,
      originalPrice,
      discountAmount: null,
      finalPrice: null
    };
  }

  const discountAmount = Math.round(originalPrice * (AUGUST_DISCOUNT_PERCENT / 100));
  const finalPrice = originalPrice - discountAmount;

  return {
    isAugust,
    originalPrice,
    discountAmount,
    finalPrice
  };
}

function buildServiceWithAugustDiscount(service: string, pricing: AugustPricing) {
  if (!pricing.isAugust) return service;

  if (pricing.originalPrice !== null && pricing.finalPrice !== null) {
    return `${service} | Oferta Agosto ${AUGUST_DISCOUNT_PERCENT}%: ${formatCLP(pricing.finalPrice)} (antes ${formatCLP(pricing.originalPrice)})`;
  }

  return `${service} | Oferta Agosto ${AUGUST_DISCOUNT_PERCENT}% aplicable sobre valor acordado`;
}

export default function BookingForm({ type, title, services }: BookingFormProps) {
  const [service, setService] = useState(services[0]);
  const [branch, setBranch] = useState(branches[0]);
  const [therapist, setTherapist] = useState(therapists[0]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [comments, setComments] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [error, setError] = useState("");

  const days = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 30 }).map((_, index) => {
      const itemDate = new Date(today);
      itemDate.setDate(today.getDate() + index);
      return itemDate;
    });
  }, []);

  const pricing = useMemo(() => getAugustPricing(service, date), [service, date]);

  useEffect(() => {
    if (!date && days.length > 0) setDate(toISODate(days[0]));
  }, [date, days]);

  useEffect(() => {
    async function loadSlots() {
      setTime("");
      setError("");
      setSubmittedMessage("");
      setWhatsappUrl("");

      if (!date || !branch || !therapist) {
        setSlots([]);
        return;
      }

      setLoadingSlots(true);

      try {
        const params = new URLSearchParams({
          area: type,
          fecha: date,
          sucursal: branch,
          masoterapeuta: therapist
        });

        const response = await fetch(`/api/disponibilidad?${params.toString()}`, { cache: "no-store" });
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
  }, [date, type, branch, therapist]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmittedMessage("");
    setWhatsappUrl("");

    if (!date || !time) {
      setError("Debes seleccionar fecha y hora.");
      return;
    }

    setSubmitting(true);

    try {
      const serviceForReservation = buildServiceWithAugustDiscount(service, pricing);

      const response = await fetch("/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          area: type,
          servicio: serviceForReservation,
          fecha: date,
          hora: time,
          sucursal: branch,
          masoterapeuta: therapist,
          nombre: name,
          email,
          telefono: phone,
          comentarios: comments
        })
      });

      const data = await response.json();

      if (!response.ok || !data.ok) throw new Error(data.error || "No se pudo guardar la reserva.");

      const message = data.automation?.whatsappMessage || `Hola, soy ${name}. Solicité una reserva para ${type}: ${serviceForReservation}, el día ${date} a las ${time}, en ${branch} con ${therapist}.`;
      setWhatsappUrl(buildWhatsAppUrl(message));
      setSubmittedMessage("Reserva registrada correctamente. Se prepararon recordatorios de 24 horas y del mismo día.");
      setName("");
      setEmail("");
      setPhone("");
      setComments("");
      setTime("");
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
        <div>
          <h2>{title}</h2>
          <p>Elige el servicio, sucursal, masoterapeuta, día disponible y luego una hora.</p>
        </div>

        <div className="booking-field-grid">
          <label className="label">
            Servicio
            <select className="select" value={service} onChange={(e) => setService(e.target.value)}>
              {services.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>

          <label className="label">
            Sucursal
            <select className="select" value={branch} onChange={(e) => setBranch(e.target.value)}>
              {branches.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>

          <label className="label">
            Masoterapeuta
            <select className="select" value={therapist} onChange={(e) => setTherapist(e.target.value)}>
              {therapists.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
        </div>

        <div>
          <strong>Selecciona un día</strong>
          <p className="small-helper">Calendario móvil de 30 días. Selecciona la fecha que necesitas.</p>
          <div className="day-strip" style={{ marginTop: 12 }}>
            {days.map((day) => {
              const iso = toISODate(day);
              const active = date === iso;

              return (
                <button
                  className={active ? "day-card active" : "day-card"}
                  type="button"
                  key={iso}
                  onClick={() => setDate(iso)}
                >
                  <small>{formatDayLabel(day)}</small>
                  <strong>{day.getDate()}</strong>
                  <small>{formatMonthLabel(day)}</small>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <strong>Horarios disponibles</strong>
          {loadingSlots && <p>Cargando horarios...</p>}
          {!loadingSlots && date && slots.length === 0 && <p>No hay horarios disponibles para esta fecha, sucursal y masoterapeuta.</p>}
          <div className="slot-grid" style={{ marginTop: 12 }}>
            {slots.map((slot) => (
              <button
                type="button"
                className={time === slot ? "slot active" : "slot"}
                key={slot}
                onClick={() => setTime(slot)}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        <div className="summary-box">
          <strong>Resumen</strong>
          <p style={{ marginBottom: 0 }}>
            Servicio: {service}<br />
            Sucursal: {branch}<br />
            Masoterapeuta: {therapist}<br />
            Fecha: {date || "No seleccionada"}<br />
            Hora: {time || "No seleccionada"}<br />
            Recordatorios: 24 horas antes y el mismo día
          </p>

          {pricing.isAugust && (
            <div className="discount-box">
              <strong>Oferta agosto activa: 20% de descuento</strong>
              {pricing.originalPrice !== null && pricing.discountAmount !== null && pricing.finalPrice !== null ? (
                <p>
                  Precio normal: {formatCLP(pricing.originalPrice)}<br />
                  Descuento aplicado: -{formatCLP(pricing.discountAmount)}<br />
                  <span>Total con descuento: {formatCLP(pricing.finalPrice)}</span>
                </p>
              ) : (
                <p>El 20% se aplicará sobre el valor acordado para este servicio.</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h2>Datos de contacto</h2>
        <form className="form" onSubmit={handleSubmit}>
          <label className="label">Nombre completo<input className="input" required value={name} onChange={(e) => setName(e.target.value)} /></label>
          <label className="label">Correo<input className="input" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          <label className="label">Teléfono / WhatsApp<input className="input" required value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
          <label className="label">Comentarios sobre el servicio<textarea className="textarea" rows={5} placeholder="Cuéntanos qué necesitas, zona de molestia, nivel de presión preferido, objetivo del masaje u otra información relevante." value={comments} onChange={(e) => setComments(e.target.value)} /></label>
          <button className="btn" type="submit" disabled={submitting}>{submitting ? "Guardando..." : "Solicitar reserva"}</button>
        </form>
        {submittedMessage && <div className="notice" style={{ marginTop: 18 }}><strong>{submittedMessage}</strong>{whatsappUrl && <p style={{ marginBottom: 0 }}><a className="btn whatsapp" href={whatsappUrl} target="_blank" rel="noopener noreferrer">Confirmar por WhatsApp</a></p>}</div>}
        {error && <div className="error" style={{ marginTop: 18 }}><strong>{error}</strong></div>}
      </div>
    </div>
  );
}
