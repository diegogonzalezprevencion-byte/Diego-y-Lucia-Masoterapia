import Link from "next/link";
import BookingForm from "../components/BookingForm";
import { buildWhatsAppUrl } from "../lib/whatsapp";
import { posts } from "../lib/blog";

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
    "Masaje Reductivo - $40.000"
  ];

  const proceso = [
    ["1", "Evaluación inicial", "Conversamos tu objetivo, molestias y preferencias de presión."],
    ["2", "Selección del servicio", "Elegimos el masaje más adecuado para relajación, descarga o bienestar."],
    ["3", "Sesión personalizada", "Se realiza la atención con enfoque cuidadoso y profesional."],
    ["4", "Autocuidado", "Se entregan recomendaciones generales de descanso, hidratación y hábitos saludables."]
  ];

  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="eyebrow">Masoterapia y bienestar</div>
            <h1>Masoterapia profesional en Providencia y Santiago</h1>
            <p>
              Servicios de masaje relajante, descontracturante, mixto, piedras calientes,
              drenaje linfático, bruxismo, piernas cansadas y bienestar corporal.
            </p>
            <div className="badge-list">
              <span className="badge">Relajación</span>
              <span className="badge">Bienestar</span>
              <span className="badge">Agenda Online</span>
              <span className="badge">Recordatorios</span>
              <span className="badge">Autocuidado</span>
            </div>
            <p style={{ marginTop: 28 }}>
              <a className="btn secondary" href="#agenda">Agendar Ahora</a>{" "}
              <Link className="btn" href="/contacto">Consultar</Link>
            </p>
          </div>
          <div className="hero-card">
            <div className="image-band">
              <div className="eyebrow" style={{ color: "#ccfbf1" }}>Bienestar corporal</div>
              <h2>Un espacio para bajar el ritmo</h2>
              <p>Agenda tu sesión, elige horario disponible y recibe confirmación por WhatsApp.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="grid-4">
            <div className="kpi"><strong>10</strong><span>Servicios de masaje</span></div>
            <div className="kpi"><strong>14</strong><span>Días visibles en agenda</span></div>
            <div className="kpi"><strong>2</strong><span>Recordatorios preparados</span></div>
            <div className="kpi"><strong>24/7</strong><span>Solicitud online</span></div>
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="container">
          <div className="eyebrow">Servicios y precios referenciales</div>
          <h2>Masajes disponibles</h2>
          <p>
            Valores referenciales para Providencia/Santiago. El precio final puede ajustarse según duración,
            modalidad, promociones o evaluación del servicio.
          </p>
          <div className="grid-3" style={{ marginTop: 28 }}>

            <div className="price-card">
              
              <h3>Masaje Relajante</h3>
              <p>60 min</p>
              <div className="price">$35.000</div>
              <p>Relajación general, disminución de tensión y pausa de bienestar.</p>
            </div>

            <div className="price-card highlight">
              <span className="badge">Más solicitado</span>
              <h3>Masaje Descontracturante</h3>
              <p>60 min</p>
              <div className="price">$40.000</div>
              <p>Trabajo focalizado en zonas de tensión muscular.</p>
            </div>

            <div className="price-card">
              
              <h3>Masaje Mixto</h3>
              <p>90 min</p>
              <div className="price">$50.000</div>
              <p>Combinación relajante y descontracturante.</p>
            </div>

            <div className="price-card">
              
              <h3>Masaje con piedras calientes</h3>
              <p>75 min</p>
              <div className="price">$48.000</div>
              <p>Relajación profunda con termoterapia superficial.</p>
            </div>

            <div className="price-card">
              
              <h3>Masaje para piernas cansadas</h3>
              <p>45 min</p>
              <div className="price">$30.000</div>
              <p>Sensación de alivio, descarga y descanso de piernas.</p>
            </div>

            <div className="price-card">
              
              <h3>Masaje craneal</h3>
              <p>30 min</p>
              <div className="price">$25.000</div>
              <p>Relajación de cuero cabelludo, cuello y zona alta.</p>
            </div>

            <div className="price-card">
              
              <h3>Masaje para bruxismo</h3>
              <p>45 min</p>
              <div className="price">$35.000</div>
              <p>Apoyo complementario para relajar musculatura facial y mandibular.</p>
            </div>

            <div className="price-card">
              
              <h3>Masaje para parálisis facial</h3>
              <p>45 min</p>
              <div className="price">$35.000</div>
              <p>Apoyo suave complementario, idealmente con indicación profesional previa.</p>
            </div>

            <div className="price-card">
              
              <h3>Masaje linfático</h3>
              <p>60 min</p>
              <div className="price">$42.000</div>
              <p>Técnica manual suave orientada a drenaje y bienestar.</p>
            </div>

            <div className="price-card">
              
              <h3>Masaje reductivo</h3>
              <p>60 min</p>
              <div className="price">$40.000</div>
              <p>Técnica estética corporal localizada, no invasiva.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="agenda">
        <div className="container">
          <div className="eyebrow">Autoagenda</div>
          <h2>Agenda tu sesión de masoterapia</h2>
          <p>Selecciona servicio, día y horario disponible directamente desde esta página.</p>
          <BookingForm type="masoterapia" title="Reserva de Masoterapia" services={services} />
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

      <section className="section alt">
        <div className="container grid-2">
          <div className="visual-card">
            <div className="visual-placeholder">Imagen sugerida: camilla, aromaterapia, toallas, luz cálida y ambiente relajante</div>
          </div>
          <div>
            <div className="eyebrow">Bienestar integral</div>
            <h2>Hábitos que complementan tu sesión</h2>
            <p>
              La masoterapia puede complementarse con hidratación, descanso suficiente,
              pausas activas, respiración consciente y alimentación equilibrada.
            </p>
            <ul className="list">
              <li>Hidratarse durante el día.</li>
              <li>Dormir y descansar adecuadamente.</li>
              <li>Evitar posturas sostenidas por muchas horas.</li>
              <li>Preferir alimentación variada y regular, sin restricciones extremas.</li>
              <li>Consultar a salud si existe dolor intenso o síntomas persistentes.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="container">
          <div className="eyebrow">Blog de bienestar</div>
          <h2>Artículos de masoterapia y autocuidado</h2>
          <div className="grid-3" style={{ marginTop: 28 }}>
            {posts.slice(0,3).map((post) => (
              <Link className="card" key={post.slug} href={`/blog/${post.slug}`}>
                <span className="badge">{post.category}</span>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
              </Link>
            ))}
          </div>
          <p style={{ marginTop: 24 }}>
            <Link className="btn dark" href="/blog">Ver blog completo</Link>{" "}
            <Link className="btn secondary" href="/newsletter">Suscribirme al newsletter</Link>
          </p>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="cta">
            <h2>¿Quieres reservar o resolver una duda?</h2>
            <p>Agenda una sesión o escríbeme por WhatsApp para consultar qué masaje se ajusta mejor a tu necesidad.</p>
            <a className="btn secondary" href="#agenda">Agendar Masoterapia</a>{" "}
            <a className="btn whatsapp" href={buildWhatsAppUrl("Hola, quiero solicitar información sobre servicios de masoterapia.")} target="_blank" rel="noopener noreferrer">Contactar por WhatsApp</a>
          </div>
        </div>
      </section>
    </main>
  );
}
