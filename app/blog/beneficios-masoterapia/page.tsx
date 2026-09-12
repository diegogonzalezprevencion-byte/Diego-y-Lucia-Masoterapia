import Link from "next/link";

export const metadata = {
  title: "Beneficios de la masoterapia profesional",
  description: "Artículo informativo sobre masoterapia y bienestar corporal."
};

export default function Page() {
  return (
    <main>
      <section className="section">
        <div className="container">
          <Link className="badge" href="/blog">← Volver al blog</Link>
          <h1>Beneficios de la masoterapia profesional</h1>
          <div className="card">
            <p>La masoterapia puede apoyar la relajación, la descarga muscular y el bienestar corporal. Es una herramienta de autocuidado que puede complementar descanso, hidratación, pausas activas y movimiento suave.</p>
            <p>Este contenido es informativo y no reemplaza evaluación médica, odontológica o kinesiológica cuando corresponda.</p>
            <Link className="btn secondary" href="/agenda-masoterapia">Agendar sesión</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
