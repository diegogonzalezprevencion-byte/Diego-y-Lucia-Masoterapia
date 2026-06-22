import AdminGuard from "../../../components/AdminGuard";
import AdminSimpleTable from "../../../components/AdminSimpleTable";

export const metadata = { title: "Newsletter", robots: { index: false, follow: false } };

export default function Page() {
  return (
    <AdminGuard>
      <main>
        <section className="section">
          <div className="container">
            <div className="eyebrow">Panel administrador</div>
            <h1>Newsletter</h1>
            <AdminSimpleTable endpoint="/api/admin/newsletter" title="Suscriptores newsletter" field="newsletter" />
          </div>
        </section>
      </main>
    </AdminGuard>
  );
}
