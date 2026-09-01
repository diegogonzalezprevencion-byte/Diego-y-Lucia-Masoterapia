import AdminGuard from "../../../components/AdminGuard";
import AdminMonthlyOffers from "../../../components/AdminMonthlyOffers";

export const metadata = { title: "Ofertas mensuales", robots: { index: false, follow: false } };

export default function Page() {
  return (
    <AdminGuard>
      <main>
        <section className="section">
          <div className="container">
            <div className="eyebrow">Panel administrador</div>
            <h1>Ofertas mensuales</h1>
            <AdminMonthlyOffers />
          </div>
        </section>
      </main>
    </AdminGuard>
  );
}
