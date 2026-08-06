import AdminGuard from "../../../components/AdminGuard";
import AdminAvailability from "../../../components/AdminAvailability";
export const metadata={title:"Gestión de Disponibilidad",robots:{index:false,follow:false}};
export default function Page(){return <AdminGuard><main><section className="section"><div className="container"><div className="eyebrow">Panel administrador</div><h1>Gestión de Disponibilidad</h1><AdminAvailability/></div></section></main></AdminGuard>}
