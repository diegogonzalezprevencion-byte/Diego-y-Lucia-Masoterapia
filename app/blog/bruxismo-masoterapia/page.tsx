import Link from "next/link";

export const metadata = {
  title: "Masoterapia facial y bruxismo: apoyo complementario",
  description: "Artículo informativo sobre masoterapia y bienestar corporal."
};

export default function Page() {
  return (
    <main>
      <section className="section">
        <div className="container">
          <Link className="badge" href="/blog">← Volver al blog</Link>
          <h1>Masoterapia facial y bruxismo: apoyo complementario</h1>
          <div className="card">
            <p>El masaje facial puede ayudar a relajar musculatura mandibular y cervical. En casos de bruxismo persistente, dolor o desgaste dental, corresponde consultar a odontología.</p>
            <p>Este contenido es informativo y no reemplaza evaluación médica, odontológica o kinesiológica cuando corresponda.</p>
            <Link className="btn secondary" href="/agenda-masoterapia">Agendar sesión</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
