export const metadata = {
  title: "Políticas de atención y privacidad",
  description: "Políticas generales de atención, privacidad y uso de datos de Umbral Corporal."
};

export default function Politicas() {
  return (
    <main>
      <section className="section">
        <div className="container">
          <div className="eyebrow">Información legal</div>
          <h1>Políticas de atención y privacidad</h1>
          <div className="card">
            <h2>Uso de datos</h2>
            <p>Los datos ingresados se utilizan para gestionar solicitudes, reservas, recordatorios y contacto relacionado con el servicio.</p>
            <h2>Reservas</h2>
            <p>Las reservas quedan inicialmente pendientes y deben ser confirmadas.</p>
            <h2>Masoterapia</h2>
            <p>Los servicios de masoterapia son de bienestar corporal y apoyo complementario. No reemplazan atención médica, kinesiológica, odontológica ni tratamientos indicados por profesionales de salud.</p>
            <h2>Cuándo consultar antes</h2>
            <p>Se recomienda consultar previamente si existe dolor intenso, lesión reciente, inflamación importante, embarazo, cirugías recientes, fiebre, trombosis, enfermedades cardiovasculares, parálisis facial u otra condición médica relevante.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
