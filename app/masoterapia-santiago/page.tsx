import Link from "next/link";

export const metadata = {
  title: "Masoterapia Profesional en Santiago",
  description: "Sesiones de masoterapia profesional, relajación y bienestar corporal en Santiago."
};

export default function Page() {
  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="eyebrow">SEO Local</div>
            <h1>Masoterapia Profesional en Santiago</h1>
            <p>Sesiones de masoterapia profesional, relajación y bienestar corporal en Santiago.</p>
            <p><Link className="btn secondary" href="/agenda-masoterapia">Agendar Masoterapia</Link></p>
          </div>
          <div className="visual-card">
            <div className="visual-placeholder">Imagen sugerida para Masoterapia Profesional en Santiago</div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container grid-3">
          <div className="card"><h3>Atención profesional</h3><p>Sesión personalizada según objetivo y preferencias.</p></div>
          <div className="card"><h3>Agenda online</h3><p>Selecciona fecha y horario disponible.</p></div>
          <div className="card"><h3>Bienestar corporal</h3><p>Relajación, descarga muscular y autocuidado.</p></div>
        </div>
      </section>
    </main>
  );
}
