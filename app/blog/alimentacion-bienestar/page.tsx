import Link from "next/link";

export const metadata = {
  title: "Bienestar, alimentación equilibrada y descanso",
  description: "Artículo informativo sobre masoterapia y bienestar corporal."
};

export default function Page() {
  return (
    <main>
      <section className="section">
        <div className="container">
          <Link className="badge" href="/blog">← Volver al blog</Link>
          <h1>Bienestar, alimentación equilibrada y descanso</h1>
          <div className="card">
            <p>Una alimentación equilibrada, buena hidratación, descanso suficiente y movimiento regular pueden complementar los beneficios de una sesión de masoterapia. No se trata de restringir, sino de sostener hábitos saludables.</p>
            <p>Este contenido es informativo y no reemplaza evaluación médica, odontológica o kinesiológica cuando corresponda.</p>
            <Link className="btn secondary" href="/agenda-masoterapia">Agendar sesión</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
