import AdminGuard from "../../../components/AdminGuard";
import AdminSimpleTable from "../../../components/AdminSimpleTable";

export const metadata = { title: "Leads capturados", robots: { index: false, follow: false } };

export default function Page() {
  return (
    <AdminGuard>
      <main>
        <section className="section">
          <div className="container">
            <div className="eyebrow">Panel administrador</div>
            <h1>Leads capturados</h1>
            <AdminSimpleTable endpoint="/api/admin/leads" title="Leads capturados" field="leads" />
          </div>
        </section>
      </main>
    </AdminGuard>
  );
}
