import Link from "next/link";

export const metadata = {
  title: "Estrés, tensión corporal y autocuidado",
  description: "Artículo informativo sobre masoterapia y bienestar corporal."
};

export default function Page() {
  return (
    <main>
      <section className="section">
        <div className="container">
          <Link className="badge" href="/blog">← Volver al blog</Link>
          <h1>Estrés, tensión corporal y autocuidado</h1>
          <div className="card">
            <p>La tensión corporal puede relacionarse con posturas sostenidas, carga laboral, estrés y falta de descanso. La masoterapia puede ayudar a relajar la musculatura y favorecer una pausa consciente.</p>
            <p>Este contenido es informativo y no reemplaza evaluación médica, odontológica o kinesiológica cuando corresponda.</p>
            <Link className="btn secondary" href="/agenda-masoterapia">Agendar sesión</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
