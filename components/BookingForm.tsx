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

function formatLongMonth(date: Date) {
  return new Intl.DateTimeFormat("es-CL", { month: "long", year: "numeric" }).format(date);
}

function formatDateForSummary(value: string) {
  if (!value) return "No seleccionada";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${day}-${month}-${year}`;
}

function getMonthKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function getMonthOptions() {
  const today = new Date();
  const current = new Date(today.getFullYear(), today.getMonth(), 1);
  const next = new Date(today.getFullYear(), today.getMonth() + 1, 1);

  return [current, next].map((date) => ({
    key: getMonthKey(date),
    label: formatLongMonth(date),
    year: date.getFullYear(),
    month: date.getMonth()
  }));
}

function getMonthCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = firstDay.getDay();
  const days: Array<Date | null> = [];

  for (let index = 0; index < startOffset; index++) days.push(null);
  for (let day = 1; day <= lastDay.getDate(); day++) days.push(new Date(year, month, day));
  while (days.length % 7 !== 0) days.push(null);

  return days;
}

function isBeforeToday(date: Date) {
  const today = new Date();
  const cleanToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const cleanDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return cleanDate < cleanToday;
}

type MonthlyOffer = {
  mes: number;
  mes_nombre: string;
  titulo: string;
  servicio: string;
  descripcion: string;
  descuento_percent: number;
  activo: boolean;
};

type DiscountPricing = {
  hasDiscount: boolean;
  offerTitle: string;
  offerMonthName: string;
  discountPercent: number;
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

function getDiscountPricing(service: string, offer?: MonthlyOffer | null): DiscountPricing {
  const discountPercent = Number(offer?.descuento_percent || 0);
  const originalPrice = extractPriceCLP(service);

  if (!offer || !offer.activo || discountPercent <= 0) {
    return { hasDiscount: false, offerTitle: "", offerMonthName: "", discountPercent: 0, originalPrice, discountAmount: null, finalPrice: null };
  }

  if (originalPrice === null) {
    return { hasDiscount: true, offerTitle: offer.titulo, offerMonthName: offer.mes_nombre, discountPercent, originalPrice, discountAmount: null, finalPrice: null };
  }

  const discountAmount = Math.round(originalPrice * (discountPercent / 100));
  const finalPrice = originalPrice - discountAmount;

  return { hasDiscount: true, offerTitle: offer.titulo, offerMonthName: offer.mes_nombre, discountPercent, originalPrice, discountAmount, finalPrice };
}

function buildServiceWithDiscount(service: string, pricing: DiscountPricing) {
  if (!pricing.hasDiscount) return service;

  if (pricing.originalPrice !== null && pricing.finalPrice !== null) {
    return `${service} | Oferta ${pricing.offerMonthName} ${pricing.discountPercent}%: ${formatCLP(pricing.finalPrice)} (antes ${formatCLP(pricing.originalPrice)})`;
  }

  return `${service} | Oferta ${pricing.offerMonthName} ${pricing.discountPercent}% aplicable sobre valor acordado`;
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
  const [monthlyOffers, setMonthlyOffers] = useState<MonthlyOffer[]>([]);
  const [availabilityByDate, setAvailabilityByDate] = useState<Record<string, boolean>>({});
  const [loadingMonthAvailability, setLoadingMonthAvailability] = useState(false);

  const monthOptions = useMemo(() => getMonthOptions(), []);
  const [selectedMonthKey, setSelectedMonthKey] = useState(monthOptions[0]?.key || getMonthKey(new Date()));

  const selectedMonth = useMemo(() => {
    return monthOptions.find((item) => item.key === selectedMonthKey) || monthOptions[0];
  }, [monthOptions, selectedMonthKey]);

  const monthCalendarDays = useMemo(() => {
    if (!selectedMonth) return [];
    return getMonthCalendarDays(selectedMonth.year, selectedMonth.month);
  }, [selectedMonth]);

  const selectedOffer = useMemo(() => {
    const selectedMonthNumber = date ? Number(date.slice(5, 7)) : 0;
    return monthlyOffers.find((offer) => offer.mes === selectedMonthNumber && offer.activo) || null;
  }, [date, monthlyOffers]);

  const pricing = useMemo(() => getDiscountPricing(service, selectedOffer), [service, selectedOffer]);

  useEffect(() => {
    async function loadMonthlyOffers() {
      try {
        const response = await fetch("/api/ofertas", { cache: "no-store" });
        const data = await response.json();
        if (data.ok && Array.isArray(data.ofertas)) setMonthlyOffers(data.ofertas);
      } catch {
        setMonthlyOffers([]);
      }
    }

    loadMonthlyOffers();
  }, []);

  useEffect(() => {
    async function loadMonthAvailability() {
      if (!selectedMonth || !branch || !therapist) {
        setAvailabilityByDate({});
        return;
      }

      setLoadingMonthAvailability(true);
      setAvailabilityByDate({});

      try {
        const realMonthDays = monthCalendarDays.filter(Boolean) as Date[];
        const entries = await Promise.all(
          realMonthDays.map(async (itemDate) => {
            const iso = toISODate(itemDate);

            if (isBeforeToday(itemDate)) return [iso, false] as const;

            const params = new URLSearchParams({
              area: type,
              fecha: iso,
              sucursal: branch,
              masoterapeuta: therapist
            });

            try {
              const response = await fetch(`/api/disponibilidad?${params.toString()}`, { cache: "no-store" });
              const data = await response.json();
              return [iso, Boolean(data.ok && Array.isArray(data.slots) && data.slots.length > 0)] as const;
            } catch {
              return [iso, false] as const;
            }
          })
        );

        setAvailabilityByDate(Object.fromEntries(entries));
      } finally {
        setLoadingMonthAvailability(false);
      }
    }

    loadMonthAvailability();
  }, [selectedMonth, monthCalendarDays, branch, therapist, type]);

  useEffect(() => {
    if (!date || loadingMonthAvailability) return;
    if (Object.prototype.hasOwnProperty.call(availabilityByDate, date) && !availabilityByDate[date]) {
      setDate("");
      setTime("");
      setSlots([]);
    }
  }, [availabilityByDate, date, loadingMonthAvailability]);

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
      const serviceForReservation = buildServiceWithDiscount(service, pricing);

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

      const message = data.automation?.whatsappMessage || `Hola, soy ${name}. Solicité una reserva para ${type}: ${serviceForReservation}, el día ${formatDateForSummary(date)} a las ${time}, en ${branch} con ${therapist}.`;
      setWhatsappUrl(buildWhatsAppUrl(message));
      setSubmittedMessage("Reserva registrada correctamente. Se prepararon recordatorios de 24 horas y del mismo día.");
      setName("");
      setEmail("");
      setPhone("");
      setComments("");
      setTime("");
      setSlots((current) => current.filter((slot) => slot !== time));
      setAvailabilityByDate((current) => ({ ...current, [date]: current[date] && slots.length > 1 }));
    } catch (err: any) {
      setError(err.message || "No se pudo registrar la reserva.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="booking-stack-layout">
      <div className="card booking-calendar-card booking-calendar-card-compact">
        <div className="booking-section-heading">
          <h2>{title}</h2>
          <p>Selecciona el mes, marca un día disponible y luego elige el horario.</p>
        </div>

        <div className="compact-calendar-shell">
          <div className="compact-calendar-controls">
            <label className="label">
              Mes disponible
              <select
                className="select compact-month-select"
                value={selectedMonthKey}
                onChange={(event) => {
                  setSelectedMonthKey(event.target.value);
                  setDate("");
                  setTime("");
                  setSlots([]);
                }}
              >
                {monthOptions.map((item) => (
                  <option key={item.key} value={item.key}>{item.label}</option>
                ))}
              </select>
            </label>

            <div className="calendar-filter-grid">
              <label className="label">
                Sucursal
                <select
                  className="select"
                  value={branch}
                  onChange={(e) => {
                    setBranch(e.target.value);
                    setDate("");
                    setTime("");
                    setSlots([]);
                  }}
                >
                  {branches.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>

              <label className="label">
                Masoterapeuta
                <select
                  className="select"
                  value={therapist}
                  onChange={(e) => {
                    setTherapist(e.target.value);
                    setDate("");
                    setTime("");
                    setSlots([]);
                  }}
                >
                  {therapists.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
            </div>

            <div className="calendar-legend">
              <span><i className="legend-dot legend-green"></i>Disponible</span>
              <span><i className="legend-dot legend-red"></i>Sin agenda</span>
            </div>
          </div>

          <div className="mini-calendar">
            <div className="mini-calendar-title">{selectedMonth?.label}</div>
            <div className="mini-calendar-weekdays">
              {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>

            <div className="mini-calendar-grid">
              {monthCalendarDays.map((day, index) => {
                if (!day) return <span className="mini-calendar-empty" key={`empty-${index}`}></span>;

                const iso = toISODate(day);
                const available = Boolean(availabilityByDate[iso]);
                const active = date === iso;
                const past = isBeforeToday(day);
                const className = [
                  "mini-calendar-day",
                  available ? "available" : "unavailable",
                  active ? "active" : "",
                  past ? "past" : ""
                ].filter(Boolean).join(" ");

                return (
                  <button
                    key={iso}
                    type="button"
                    className={className}
                    disabled={!available || past || loadingMonthAvailability}
                    onClick={() => {
                      setDate(iso);
                      setTime("");
                    }}
                    title={available ? "Día con horarios disponibles" : "Día sin agenda disponible"}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>

            {loadingMonthAvailability && <p className="mini-calendar-loading">Revisando disponibilidad...</p>}
          </div>
        </div>

        <div className="booking-slots-panel compact-slots-panel">
          <div className="booking-subheading">
            <strong>Horarios disponibles</strong>
            {date && <p className="small-helper">Fecha seleccionada: {formatDateForSummary(date)}</p>}
          </div>
          {loadingSlots && <p>Cargando horarios...</p>}
          {!loadingSlots && !date && <p>Primero selecciona un día marcado en verde.</p>}
          {!loadingSlots && date && slots.length === 0 && <p>No hay horarios disponibles para esta fecha, sucursal y masoterapeuta.</p>}
          <div className="slot-grid compact-slot-grid" style={{ marginTop: 12 }}>
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
      </div>

      <div className="card booking-contact-card">
        <div className="booking-section-heading">
          <h2>Datos de contacto</h2>
          <p>Indica el servicio que deseas y completa tus datos de contacto para enviar la solicitud. La sucursal y el masoterapeuta ya se definen en el calendario.</p>
        </div>

        <form className="form booking-contact-form" onSubmit={handleSubmit}>
          <div className="booking-details-grid">
            <label className="label">
              Servicio
              <select className="select" value={service} onChange={(e) => setService(e.target.value)}>
                {services.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>

          </div>

          <label className="label">Nombre completo<input className="input" required value={name} onChange={(e) => setName(e.target.value)} /></label>
          <label className="label">Correo<input className="input" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          <label className="label">Teléfono / WhatsApp<input className="input" required value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
          <label className="label">Comentarios sobre el servicio<textarea className="textarea" rows={5} placeholder="Cuéntanos qué necesitas, zona de molestia, nivel de presión preferido, objetivo del masaje u otra información relevante." value={comments} onChange={(e) => setComments(e.target.value)} /></label>
          <button className="btn" type="submit" disabled={submitting}>{submitting ? "Guardando..." : "Solicitar reserva"}</button>
        </form>

        <div className="summary-box booking-summary-below">
          <strong>Resumen</strong>
          <p style={{ marginBottom: 0 }}>
            Servicio: {service}<br />
            Sucursal: {branch}<br />
            Masoterapeuta: {therapist}<br />
            Fecha: {formatDateForSummary(date)}<br />
            Hora: {time || "No seleccionada"}<br />
            Recordatorios: 24 horas antes y el mismo día
          </p>

          {pricing.hasDiscount && (
            <div className="discount-box">
              <strong>Oferta {pricing.offerMonthName} activa: {pricing.discountPercent}% de descuento</strong>
              <p className="discount-title">{pricing.offerTitle}</p>
              {pricing.originalPrice !== null && pricing.discountAmount !== null && pricing.finalPrice !== null ? (
                <p>
                  Precio normal: {formatCLP(pricing.originalPrice)}<br />
                  Descuento aplicado: -{formatCLP(pricing.discountAmount)}<br />
                  <span>Total con descuento: {formatCLP(pricing.finalPrice)}</span>
                </p>
              ) : (
                <p>El {pricing.discountPercent}% se aplicará sobre el valor acordado para este servicio.</p>
              )}
            </div>
          )}
        </div>

        {submittedMessage && <div className="notice" style={{ marginTop: 18 }}><strong>{submittedMessage}</strong>{whatsappUrl && <p style={{ marginBottom: 0 }}><a className="btn whatsapp" href={whatsappUrl} target="_blank" rel="noopener noreferrer">Confirmar por WhatsApp</a></p>}</div>}
        {error && <div className="error" style={{ marginTop: 18 }}><strong>{error}</strong></div>}
      </div>
    </div>
  );
}
