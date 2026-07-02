"use client";

import { useState } from "react";

const monthlyCampaigns = [
  { month: "Enero", title: "Verano sin tensión", service: "Masaje Relajante · Piernas Cansadas", idea: "Masaje de relajación o piernas cansadas con precio especial para quienes vuelven de vacaciones o están con fatiga por calor.", accent: "summer" },
  { month: "Febrero", title: "Mes del amor propio", service: "Masaje Mixto · Regala bienestar", idea: "Promoción parcial 2x1 o descuento para parejas y amigos. También puede presentarse como una campaña de regalo de bienestar.", accent: "love" },
  { month: "Marzo", title: "Vuelta a la rutina", service: "Masaje Descontracturante", idea: "Masaje descontracturante con enfoque en cuello, espalda y hombros para aliviar el estrés laboral y la tensión del regreso a la rutina.", accent: "routine" },
  { month: "Abril", title: "Renueva tu energía", service: "Pack de 3 sesiones", idea: "Pack de 3 sesiones con descuento para empezar el otoño con bienestar corporal y una rutina de autocuidado.", accent: "energy" },
  { month: "Mayo", title: "Especial mamá / cuidado femenino", service: "Gift Card · Masaje Relajante Premium", idea: "Gift card o masaje relajante premium como detalle de bienestar para el Día de la Madre.", accent: "care" },
  { month: "Junio", title: "Invierno sin contracturas", service: "Descontracturante + Piedras Calientes", idea: "Masaje descontracturante combinado con piedras calientes o terapia de calor para aliviar tensión durante el invierno.", accent: "winter" },
  { month: "Julio", title: "Pausa de mitad de año", service: "Masaje Relajante · Masaje Mixto", idea: "Pack antiestrés con masaje relajante o mixto en valor promocional para hacer una pausa reparadora.", accent: "pause" },
  { month: "Agosto", title: "Mes de la espalda sana", service: "Masaje Descontracturante", idea: "Oferta enfocada en espalda, zona lumbar, cuello y hombros. Ideal para personas que trabajan sentadas o en oficina.", accent: "back" },
  { month: "Septiembre", title: "Recupera tu cuerpo post fiestas", service: "Linfático · Piernas Cansadas", idea: "Masaje de drenaje linfático, piernas cansadas o relajación para apoyar la recuperación corporal después de celebraciones.", accent: "restore" },
  { month: "Octubre", title: "Primavera en equilibrio", service: "Relajante + Bruxismo o Craneal", idea: "Combinación de masaje relajante con trabajo facial, bruxismo o masaje craneal para renovar energía en primavera.", accent: "spring" },
  { month: "Noviembre", title: "Prepárate para fin de año", service: "Pack Preventivo 2 o 3 sesiones", idea: "Pack preventivo de 2 o 3 sesiones antes del aumento de carga y estrés típico de fin de año.", accent: "prepare" },
  { month: "Diciembre", title: "Regala bienestar", service: "Gift Cards · Packs Especiales", idea: "Gift cards navideñas, promociones para regalar y packs especiales de fin de año para compartir bienestar.", accent: "gift" }
];

export default function PromoCalendar() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeCampaign = monthlyCampaigns[activeIndex];

  return (
    <section className="section alt promo-calendar-section" id="calendario-ofertas">
      <div className="container">
        <div className="eyebrow">Calendario Enero a Diciembre</div>
        <h2>Ofertas mensuales de masoterapia</h2>
        <p>Revisa la campaña del mes y descubre promociones, packs y servicios destacados para acompañar tu bienestar durante todo el año.</p>

        <div className={`promo-interactive-card promo-theme-${activeCampaign.accent}`}>
          <div className="promo-orbit promo-orbit-one"></div>
          <div className="promo-orbit promo-orbit-two"></div>
          <div className="promo-orbit promo-orbit-three"></div>

          <div className="promo-content-shell">
            <div className="promo-content" key={activeCampaign.month}>
              <div className="promo-slide-top">
                <span className="promo-month">{activeCampaign.month}</span>
                <span className="promo-service-tag">{activeCampaign.service}</span>
              </div>
              <h3>{activeCampaign.title}</h3>
              <p>{activeCampaign.idea}</p>
              <div className="promo-mini-note">
                <span>Oferta destacada</span>
                <strong>{String(activeIndex + 1).padStart(2, "0")} / 12</strong>
              </div>
            </div>

            <div className="promo-visual" key={`${activeCampaign.month}-visual`}>
              <span className="promo-visual-main">{activeCampaign.month.slice(0, 3)}</span>
              <span className="promo-visual-sub">Bienestar del mes</span>
            </div>
          </div>

          <div className="promo-month-buttons" aria-label="Seleccionar mes de oferta">
            {monthlyCampaigns.map((campaign, index) => (
              <button
                key={campaign.month}
                type="button"
                className={index === activeIndex ? "active" : ""}
                onClick={() => setActiveIndex(index)}
                aria-pressed={index === activeIndex}
              >
                {campaign.month}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
