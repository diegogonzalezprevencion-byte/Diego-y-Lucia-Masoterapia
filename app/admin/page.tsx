import Link from "next/link";
import AdminGuard from "../../components/AdminGuard";

export const metadata = { title: "Panel Administrador", robots: { index: false, follow: false } };

export default function AdminPage() {
  return (
    <AdminGuard>
      <main>
        <section className="section">
          <div className="container">
            <div className="eyebrow">Panel privado</div>
            <h1>Panel Administrador</h1>
            <p>Gestiona reservas de masoterapia, disponibilidad, recordatorios, testimonios, galería y métricas.</p>
            <div className="grid-3" style={{ marginTop: 28 }}>
              <div className="card"><h2>Dashboard</h2><Link className="btn dark" href="/admin/dashboard">Ver métricas</Link></div>
              <div className="card"><h2>Reservas</h2><Link className="btn" href="/admin/reservas">Ver reservas</Link></div>
              <div className="card"><h2>Disponibilidad</h2><Link className="btn secondary" href="/admin/disponibilidad">Gestionar</Link></div>
              <div className="card"><h2>Recordatorios</h2><Link className="btn dark" href="/admin/recordatorios">Ver recordatorios</Link></div>
              <div className="card"><h2>Testimonios</h2><Link className="btn" href="/admin/testimonios">Gestionar</Link></div>
              <div className="card"><h2>Galería</h2><Link className="btn secondary" href="/admin/galeria">Gestionar</Link></div>
            </div>
          </div>
        </section>
      </main>
    </AdminGuard>
  );
}
