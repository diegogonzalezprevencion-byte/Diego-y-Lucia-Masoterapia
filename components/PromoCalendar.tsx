"use client";

import { useEffect, useState } from "react";
import PublicTestimonials from "./PublicTestimonials";

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

const fallbackOffers: MonthlyOffer[] = [
  { mes: 8, mes_nombre: "Agosto", titulo: "Agosto con 20% de descuento", servicio: "20% de descuento · Todos los masajes", descripcion: "Durante agosto, agenda cualquier tipo de masaje y recibe un 20% de descuento. El descuento se aplica automáticamente al seleccionar una fecha de agosto en la agenda. Válido solo durante agosto.", descuento_percent: 20, accent: "back", activo: true },
  { mes: 9, mes_nombre: "Septiembre", titulo: "Recupera tu cuerpo post fiestas", servicio: "Linfático · Piernas Cansadas", descripcion: "Masaje de drenaje linfático, piernas cansadas o relajación para apoyar la recuperación corporal después de celebraciones.", descuento_percent: 0, accent: "restore", activo: true }
];

export default function PromoCalendar() {
  const [offers, setOffers] = useState<MonthlyOffer[]>(fallbackOffers);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const activeCampaign = offers[activeIndex] || offers[0];

  useEffect(() => {
    async function loadOffers() {
      try {
        const response = await fetch("/api/ofertas", { cache: "no-store" });
        const data = await response.json();
        if (data.ok && Array.isArray(data.ofertas) && data.ofertas.length > 0) {
          setOffers(data.ofertas);
          setActiveIndex(0);
        }
      } finally {
        setLoading(false);
      }
    }

    loadOffers();
  }, []);

  return (
    <section className="section alt promo-calendar-section" id="calendario-ofertas">
      <div className="container">
        <div className="eyebrow">Ofertas disponibles</div>
        <h2>Ofertas mensuales de masoterapia</h2>
        <p>Revisa solo las promociones vigentes para el mes en curso y el mes siguiente. Las campañas avanzan automáticamente mes a mes.</p>

        <div className="promo-testimonials-split">
          <div className="promo-calendar-column">
            <div className={`promo-interactive-card promo-theme-${activeCampaign?.accent || "back"}`}>
              <div className="promo-orbit promo-orbit-one"></div>
              <div className="promo-orbit promo-orbit-two"></div>
              <div className="promo-orbit promo-orbit-three"></div>

              <div className="promo-content-shell">
                {activeCampaign ? (
                  <div className="promo-content" key={activeCampaign.mes_nombre}>
                    <div className="promo-slide-top">
                      <span className="promo-month">{activeCampaign.mes_nombre}</span>
                      <span className="promo-service-tag">{activeCampaign.servicio}</span>
                    </div>
                    <h3>{activeCampaign.titulo}</h3>
                    <p>{activeCampaign.descripcion}</p>
                    <div className="promo-mini-note">
                      <span>{activeCampaign.descuento_percent > 0 ? `${activeCampaign.descuento_percent}% de descuento automático` : "Oferta destacada"}</span>
                      <strong>{String(activeIndex + 1).padStart(2, "0")} / {offers.length}</strong>
                    </div>
                  </div>
                ) : (
                  <div className="promo-content"><h3>Pronto nuevas ofertas</h3><p>Estamos preparando nuevas campañas de bienestar para los próximos meses.</p></div>
                )}
              </div>

              <div className="promo-month-buttons" aria-label="Seleccionar mes de oferta">
                {offers.map((campaign, index) => (
                  <button key={campaign.mes} type="button" className={index === activeIndex ? "active" : ""} onClick={() => setActiveIndex(index)} aria-pressed={index === activeIndex}>
                    {campaign.mes_nombre}
                  </button>
                ))}
              </div>

              {loading && <p className="small-helper">Actualizando ofertas disponibles...</p>}
            </div>
          </div>

          <PublicTestimonials />
        </div>
      </div>
    </section>
  );
}
