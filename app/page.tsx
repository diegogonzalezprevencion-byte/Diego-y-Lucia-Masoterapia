import BookingForm from "../components/BookingForm";
import { buildWhatsAppUrl } from "../lib/whatsapp";

export default function Home() {
  const services = [
    "Masaje Relajante - $35.000",
    "Masaje Descontracturante - $40.000",
    "Masaje Mixto - $50.000",
    "Masaje con Piedras Calientes - $48.000",
    "Masaje Piernas Cansadas - $30.000",
    "Masaje Craneal - $25.000",
    "Masaje para Bruxismo - $35.000",
    "Masaje para Parálisis Facial - $35.000",
    "Masaje Linfático - $42.000",
    "Masaje Reductivo - $40.000",
    "Otros - Consultar"
  ];

  const serviceCards = [
    ["Masaje Relajante", "60 min", "$35.000", "Relajación general, disminución de tensión y pausa de bienestar.", "/servicio-relajante.png"],
    ["Masaje Descontracturante", "60 min", "$40.000", "Trabajo focalizado en zonas de tensión muscular.", "/servicio-descontracturante.png"],
    ["Masaje Mixto", "90 min", "$50.000", "Combinación relajante y descontracturante.", "/servicio-mixto.png"],
    ["Masaje con Piedras Calientes", "75 min", "$48.000", "Relajación profunda con termoterapia superficial.", "/servicio-piedras.png"],
    ["Piernas Cansadas", "45 min", "$30.000", "Sensación de alivio, descarga y descanso de piernas.", "/servicio-piernas.png"],
    ["Masaje Craneal", "30 min", "$25.000", "Relajación de cuero cabelludo, cuello y zona alta.", "/servicio-craneal.png"],
    ["Masaje para Bruxismo", "45 min", "$35.000", "Apoyo complementario para relajar musculatura facial y mandibular.", "/servicio-bruxismo.png"],
    ["Masaje para Parálisis Facial", "45 min", "$35.000", "Apoyo suave complementario, idealmente con indicación profesional previa.", "/servicio-paralisis.png"],
    ["Masaje Linfático", "60 min", "$42.000", "Técnica manual suave orientada a drenaje y bienestar.", "/servicio-linfatico.png"],
    ["Masaje Reductivo", "60 min", "$40.000", "Técnica estética corporal localizada, no invasiva.", "/servicio-reductivo.png"],
    ["Otros", "A convenir", "Consultar", "Consulta por otros masajes específicos.", "/servicio-otros.svg"]
  ];


  const monthlyCampaigns = [
    {
      month: "Enero",
      title: "Verano sin tensión",
      service: "Masaje Relajante · Piernas Cansadas",
      idea: "Masaje de relajación o piernas cansadas con precio especial para quienes vuelven de vacaciones o están con fatiga por calor."
    },
    {
      month: "Febrero",
      title: "Mes del amor propio",
      service: "Promoción para parejas o amigos",
      idea: "Promoción 2x1 parcial o descuento para parejas y amigos. También puede ser una campaña para regalar bienestar."
    },
    {
      month: "Marzo",
      title: "Vuelta a la rutina",
      service: "Masaje Descontracturante",
      idea: "Masaje descontracturante con enfoque en cuello, espalda y hombros por estrés laboral."
    },
    {
      month: "Abril",
      title: "Renueva tu energía",
      service: "Pack de 3 sesiones",
      idea: "Pack de 3 sesiones con descuento para empezar el otoño con bienestar corporal."
    },
    {
      month: "Mayo",
      title: "Especial mamá / cuidado femenino",
      service: "Gift Card · Masaje Relajante Premium",
      idea: "Gift card o masaje relajante premium por el Día de la Madre."
    },
    {
      month: "Junio",
      title: "Invierno sin contracturas",
      service: "Descontracturante + Piedras Calientes",
      idea: "Masaje descontracturante más piedras calientes o terapia de calor para el bienestar corporal en invierno."
    },
    {
      month: "Julio",
      title: "Pausa de mitad de año",
      service: "Masaje Relajante · Masaje Mixto",
      idea: "Pack antiestrés con masaje relajante o mixto con valor promocional."
    },
    {
      month: "Agosto",
      title: "Mes de la espalda sana",
      service: "Espalda · Lumbar · Cuello · Hombros",
      idea: "Oferta enfocada en espalda, zona lumbar, cuello y hombros. Ideal para trabajadores de oficina."
    },
    {
      month: "Septiembre",
      title: "Recupera tu cuerpo post fiestas",
      service: "Drenaje Linfático · Piernas Cansadas",
      idea: "Masaje de drenaje linfático, piernas cansadas o relajación post celebraciones."
    },
    {
      month: "Octubre",
      title: "Primavera en equilibrio",
      service: "Relajante + Bruxismo o Craneal",
      idea: "Masaje relajante más facial/bruxismo o craneal para renovar energía."
    },
    {
      month: "Noviembre",
      title: "Prepárate para fin de año",
      service: "Pack Preventivo 2 o 3 sesiones",
      idea: "Pack preventivo de 2 o 3 sesiones antes del estrés de diciembre."
    },
    {
      month: "Diciembre",
      title: "Regala bienestar",
      service: "Gift Cards · Packs Especiales",
      idea: "Gift cards navideñas, promociones para regalar y packs especiales de fin de año."
    }
  ];

  const proceso = [
    ["1", "Escucha inicial", "Conversamos tu objetivo, molestias y preferencias de presión."],
    ["2", "Servicio adecuado", "Elegimos el masaje más apropiado para relajación, descarga o bienestar."],
    ["3", "Sesión personalizada", "Se realiza la atención con enfoque profesional y cuidadoso."],
    ["4", "Autocuidado", "Recibes recomendaciones generales de descanso, hidratación y hábitos saludables."]
  ];

  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <img src="/logo-umbral-corporal.png" alt="Umbral Corporal" className="hero-logo" />
            <div className="eyebrow">Masoterapia · Relajación · Bienestar</div>
            <h1>Bienestar que se siente, equilibrio que transforma</h1>
            <p>
              En Umbral Corporal ofrecemos masoterapia profesional para ayudarte a bajar el ritmo,
              aliviar tensión corporal y reconectar con tu bienestar.
            </p>
            <div className="badge-list">
              <span className="badge">Relajación profunda</span>
              <span className="badge">Descarga muscular</span>
              <span className="badge">Atención personalizada</span>
              <span className="badge">Autoagenda</span>
              <span className="badge">Santiago / San Miguel</span>
            </div>
            <p style={{ marginTop: 28 }}>
              <a className="btn" href="#agenda">Agendar ahora</a>{" "}
              <a className="btn secondary" href="#servicios">Ver servicios</a>
            </p>
          </div>
          <div className="hero-photo-card hero-slider-card">
            <div className="hero-slider" aria-label="Galería de Umbral Corporal">
              <img src="/hero-slide-1.png" alt="Equipo de Umbral Corporal" className="hero-slide hero-slide-1" />
              <img src="/hero-slide-2.png" alt="Sala de masoterapia cálida y relajante" className="hero-slide hero-slide-2" />
              <img src="/hero-slide-3.png" alt="Espacio real de atención de Umbral Corporal" className="hero-slide hero-slide-3" />
              <img src="/hero-slide-4.png" alt="Masoterapia profesional en ambiente de bienestar" className="hero-slide hero-slide-4" />
            </div>
            <div className="hero-photo-caption">
              <strong>Equipo Umbral Corporal</strong>
              <span>Atención profesional y personalizada</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section alt promo-calendar-section" id="calendario-ofertas">
        <div className="container">
          <div className="eyebrow">Calendario Enero a Diciembre</div>
          <h2>Ofertas mensuales de masoterapia</h2>
          <p>
            Revisa la campaña del mes y descubre promociones, packs y servicios destacados
            para acompañar tu bienestar durante todo el año.
          </p>

          <div className="promo-slider-card">
            <div className="promo-slider" aria-label="Calendario mensual de ofertas">
              {monthlyCampaigns.map((campaign, index) => (
                <article className={`promo-slide promo-slide-${index + 1}`} key={campaign.month}>
                  <div className="promo-slide-top">
                    <span className="promo-month">{campaign.month}</span>
                    <span className="promo-service-tag">{campaign.service}</span>
                  </div>
                  <h3>{campaign.title}</h3>
                  <p>{campaign.idea}</p>
                </article>
              ))}
            </div>

            <div className="promo-month-list" aria-hidden="true">
              {monthlyCampaigns.map(({ month }) => (
                <span key={month}>{month}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="agenda">
        <div className="container">
          <div className="eyebrow">Autoagenda principal</div>
          <h2>Agenda tu sesión de masoterapia</h2>
          <p>Selecciona servicio, día y horario disponible directamente desde la página principal.</p>
          <BookingForm type="masoterapia" title="Reserva de Masoterapia" services={services} />
        </div>
      </section>

      <section className="section soft" id="servicios">
        <div className="container">
          <div className="eyebrow">Servicios y precios referenciales</div>
          <h2>Nuestros servicios</h2>
          <p>
            Valores referenciales para Santiago/San Miguel. El precio final puede ajustarse según duración,
            modalidad, promociones o evaluación del servicio.
          </p>
          <div className="grid-3" style={{ marginTop: 28 }}>
            {serviceCards.map(([name, duration, price, description, image], index) => (
              <div className={index === 1 ? "price-card highlight" : "price-card"} key={name}>
                {index === 1 && <span className="badge">Más solicitado</span>}
                <img className={index === 0 ? "service-thumb-relajante-original" : index === 1 ? "service-thumb-descontracturante-original" : index === 2 ? "service-thumb-mixto-original" : index === 3 ? "service-thumb-piedras-original" : index === 4 ? "service-thumb-piernas-original" : index === 5 ? "service-thumb-craneal-original" : index === 6 ? "service-thumb-bruxismo-original" : index === 7 ? "service-thumb-paralisis-original" : index === 8 ? "service-thumb-linfatico-original" : index === 9 ? "service-thumb-reductivo-original" : "service-thumb"} src={image} alt={name} />
                <h3>{name}</h3>
                <p>{duration}</p>
                <div className="price">{price}</div>
                <p>{description}</p>
              </div>
            ))}
          </div>
          <div className="notice" style={{ marginTop: 24 }}>
            Los servicios de masoterapia son de bienestar corporal y apoyo complementario. No reemplazan atención médica, kinesiológica u odontológica.
          </div>
        </div>
      </section>

      <section className="section dark">
        <div className="container">
          <div className="eyebrow">Proceso de atención</div>
          <h2>Una experiencia de bienestar ordenada y profesional</h2>
          <div className="grid-4" style={{ marginTop: 28 }}>
            {proceso.map(([num, title, text]) => (
              <div className="card process-step" key={num}>
                <div className="step-number">{num}</div>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section alt" id="bienestar-integral">
        <div className="container">
          <div className="wellness-full-card">
            <img
              src="/bienestar-integral.png"
              alt="Bienestar integral: hidratación, dormir, evitar malas posturas, buena alimentación y masajes"
              className="wellness-full-image"
            />
          </div>
        </div>
      </section>
<section className="section alt">
        <div className="container">
          <div className="cta">
            <h2>¿Quieres reservar o resolver una duda?</h2>
            <p>Agenda una sesión o escríbenos por WhatsApp para consultar qué masaje se ajusta mejor a tu necesidad.</p>
            <a className="btn" href="#agenda">Agendar Masoterapia</a>{" "}
            <a className="btn whatsapp" href={buildWhatsAppUrl("Hola, quiero solicitar información sobre los servicios de Umbral Corporal.")} target="_blank" rel="noopener noreferrer">Contactar por WhatsApp</a>
          </div>
        </div>
      </section>
    </main>
  );
}
