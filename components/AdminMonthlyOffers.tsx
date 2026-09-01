"use client";

import { useEffect, useMemo, useState } from "react";

type MonthlyOffer = {
  id?: string;
  mes: number;
  mes_nombre: string;
  titulo: string;
  servicio: string;
  descripcion: string;
  descuento_percent: number;
  accent: string;
  activo: boolean;
};

const accents = ["summer", "love", "routine", "energy", "care", "winter", "pause", "back", "restore", "spring", "prepare", "gift"];

export default function AdminMonthlyOffers() {
  const [offers, setOffers] = useState<MonthlyOffer[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(8);
  const [titulo, setTitulo] = useState("");
  const [servicio, setServicio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [descuentoPercent, setDescuentoPercent] = useState(0);
  const [accent, setAccent] = useState("back");
  const [activo, setActivo] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");

  const selectedOffer = useMemo(() => offers.find((offer) => offer.mes === selectedMonth), [offers, selectedMonth]);

  function fillForm(offer?: MonthlyOffer) {
    if (!offer) return;
    setTitulo(offer.titulo || "");
    setServicio(offer.servicio || "");
    setDescripcion(offer.descripcion || "");
    setDescuentoPercent(Number(offer.descuento_percent || 0));
    setAccent(offer.accent || "routine");
    setActivo(offer.activo !== false);
  }

  async function loadOffers(targetMonth = selectedMonth) {
    setLoading(true);
    setError("");
    setWarning("");
    try {
      const response = await fetch("/api/admin/ofertas", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "No se pudieron cargar las ofertas.");
      const loadedOffers = data.ofertas || [];
      setOffers(loadedOffers);
      if (data.warning) setWarning(data.warning);
      fillForm(loadedOffers.find((offer: MonthlyOffer) => offer.mes === targetMonth) || loadedOffers[0]);
    } catch (err: any) {
      setError(err.message || "No se pudieron cargar las ofertas.");
    } finally {
      setLoading(false);
    }
  }

  function changeMonth(month: number) {
    setSelectedMonth(month);
    fillForm(offers.find((offer) => offer.mes === month));
    setSuccess("");
    setError("");
  }

  async function saveOffer(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setSuccess("");
    setError("");

    try {
      const response = await fetch("/api/admin/ofertas", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mes: selectedMonth,
          mes_nombre: selectedOffer?.mes_nombre,
          titulo,
          servicio,
          descripcion,
          descuento_percent: descuentoPercent,
          accent,
          activo
        })
      });

      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "No se pudo guardar la oferta.");

      setSuccess("Oferta mensual actualizada correctamente.");
      await loadOffers(selectedMonth);
    } catch (err: any) {
      setError(err.message || "No se pudo guardar la oferta.");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => { loadOffers(); }, []);

  return (
    <div className="admin-offers-layout">
      <div className="card">
        <h2>Modificar oferta mensual</h2>
        <p>Administra las ofertas del año. En la página pública solo se mostrarán el mes en curso y el mes siguiente.</p>

        <form className="form" onSubmit={saveOffer}>
          <label className="label">
            Mes
            <select className="select" value={selectedMonth} onChange={(e) => changeMonth(Number(e.target.value))}>
              {offers.map((offer) => <option key={offer.mes} value={offer.mes}>{offer.mes_nombre}</option>)}
            </select>
          </label>

          <label className="label">Título de la oferta<input className="input" value={titulo} onChange={(e) => setTitulo(e.target.value)} required /></label>
          <label className="label">Servicio destacado<input className="input" value={servicio} onChange={(e) => setServicio(e.target.value)} required /></label>
          <label className="label">Descripción visible para clientes<textarea className="textarea" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required /></label>

          <div className="booking-field-grid">
            <label className="label">Descuento automático (%)<input className="input" type="number" min="0" max="100" value={descuentoPercent} onChange={(e) => setDescuentoPercent(Number(e.target.value))} /></label>
            <label className="label">Estilo visual<select className="select" value={accent} onChange={(e) => setAccent(e.target.value)}>{accents.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          </div>

          <label className="testimonial-admin-check"><input type="checkbox" checked={activo} onChange={(e) => setActivo(e.target.checked)} />Oferta activa</label>
          <button className="btn" type="submit" disabled={saving || loading}>{saving ? "Guardando..." : "Guardar oferta"}</button>
        </form>

        {warning && <div className="notice" style={{ marginTop: 16 }}><strong>Atención:</strong> {warning}</div>}
        {success && <div className="notice" style={{ marginTop: 16 }}><strong>{success}</strong></div>}
        {error && <div className="error" style={{ marginTop: 16 }}><strong>{error}</strong></div>}
      </div>

      <div className="card">
        <h2>Ofertas configuradas</h2>
        <p>Vista general de las campañas cargadas para cada mes.</p>
        {loading && <p>Cargando ofertas...</p>}
        <div className="table-wrap reservations-compact-wrap">
          <table className="table reservations-compact-table admin-offers-table">
            <thead><tr><th>Mes</th><th>Oferta</th><th>Servicio</th><th>Descuento</th><th>Estado</th><th>Acción</th></tr></thead>
            <tbody>
              {offers.map((offer) => (
                <tr key={offer.mes}>
                  <td><strong>{offer.mes_nombre}</strong></td>
                  <td>{offer.titulo}</td>
                  <td>{offer.servicio}</td>
                  <td>{offer.descuento_percent > 0 ? `${offer.descuento_percent}%` : "Sin descuento"}</td>
                  <td><span className={`status-pill ${offer.activo ? "status-confirmada" : "status-pendiente"}`}>{offer.activo ? "Activa" : "Oculta"}</span></td>
                  <td><button className="btn secondary" type="button" onClick={() => changeMonth(offer.mes)}>Editar</button></td>
                </tr>
              ))}
              {!loading && offers.length === 0 && <tr><td colSpan={6}>No hay ofertas configuradas.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
