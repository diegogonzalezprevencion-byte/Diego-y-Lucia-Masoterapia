import AdminGuard from "../../../components/AdminGuard";
import AdminContacts from "../../../components/AdminContacts";

export const metadata = { title: "Gestión de Contactos", robots: { index: false, follow: false } };

export default function Page() {
  return (
    <AdminGuard>
      <main>
        <section className="section">
          <div className="container">
            <div className="eyebrow">Panel administrador</div>
            <h1>Gestión de Contactos</h1>
            <AdminContacts />
          </div>
        </section>
      </main>
    </AdminGuard>
  );
}
