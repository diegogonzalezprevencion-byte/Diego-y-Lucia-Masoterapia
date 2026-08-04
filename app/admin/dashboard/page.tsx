import AdminGuard from "../../../components/AdminGuard";
import AdminDashboard from "../../../components/AdminDashboard";
export const metadata={title:"Dashboard Admin",robots:{index:false,follow:false}};
export default function Page(){return <AdminGuard><main><section className="section"><div className="container"><div className="eyebrow">Panel administrador</div><h1>Dashboard de métricas</h1><AdminDashboard/></div></section></main></AdminGuard>}
