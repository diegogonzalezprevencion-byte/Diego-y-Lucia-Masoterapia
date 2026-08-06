import Link from "next/link";

export const metadata = {
  title: "Piernas cansadas y drenaje: cuándo consultar",
  description: "Artículo informativo sobre masoterapia y bienestar corporal."
};

export default function Page() {
  return (
    <main>
      <section className="section">
        <div className="container">
          <Link className="badge" href="/blog">← Volver al blog</Link>
          <h1>Piernas cansadas y drenaje: cuándo consultar</h1>
          <div className="card">
            <p>El masaje para piernas cansadas y el drenaje manual pueden apoyar la sensación de alivio. Si existe dolor intenso, hinchazón marcada, cambios de color o antecedentes médicos, se debe consultar a un profesional de salud.</p>
            <p>Este contenido es informativo y no reemplaza evaluación médica, odontológica o kinesiológica cuando corresponda.</p>
            <Link className="btn secondary" href="/agenda-masoterapia">Agendar sesión</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
