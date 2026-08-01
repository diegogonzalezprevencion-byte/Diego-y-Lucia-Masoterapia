import AdminGuard from "../../../components/AdminGuard";
import AdminPaymentPrep from "../../../components/AdminPaymentPrep";

export const metadata = { title: "Pagos", robots: { index: false, follow: false } };

export default function Page() {
  return <AdminGuard><main><section className="section"><div className="container"><div className="eyebrow">Panel administrador</div><h1>Preparación de pagos</h1><AdminPaymentPrep /></div></section></main></AdminGuard>;
}
