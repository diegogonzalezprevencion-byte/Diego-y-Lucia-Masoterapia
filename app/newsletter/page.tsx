import NewsletterForm from "../../components/NewsletterForm";

export const metadata = {
  title: "Newsletter",
  description: "Suscripción a novedades de Umbral Corporal."
};

export default function NewsletterPage() {
  return (
    <main>
      <section className="section">
        <div className="container">
          <div className="eyebrow">Newsletter</div>
          <h1>Recibe información útil de bienestar</h1>
          <p>Suscríbete para recibir contenidos sobre masoterapia, relajación, autocuidado y bienestar corporal.</p>
          <div className="grid-2" style={{ marginTop: 28 }}>
            <div className="card">
              <h2>Suscripción</h2>
              <NewsletterForm />
            </div>
            <div className="card">
              <h2>Temas incluidos</h2>
              <ul className="list">
                <li>Masoterapia y relajación.</li>
                <li>Autocuidado corporal.</li>
                <li>Bienestar, descanso e hidratación.</li>
                <li>Alimentación equilibrada y hábitos saludables.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
