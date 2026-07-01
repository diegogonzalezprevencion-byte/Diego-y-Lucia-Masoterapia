import BookingForm from "../../components/BookingForm";

export const metadata = {
  title: "Agenda Masoterapia",
  description: "Agenda online para Umbral Corporal, masoterapia profesional y bienestar corporal."
};

export default function AgendaMasoterapia() {
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

  return (
    <main>
      <section className="section">
        <div className="container">
          <div className="eyebrow">Calendario profesional</div>
          <h1>Agenda Masoterapia</h1>
          <p>Selecciona un día, revisa horarios disponibles y solicita tu reserva.</p>
          <BookingForm type="masoterapia" title="Reserva de Masoterapia" services={services} />
        </div>
      </section>
    </main>
  );
}
