import AdminGuard from "../../../components/AdminGuard";
import AdminReminders from "../../../components/AdminReminders";
export const metadata={title:"Gestión de Recordatorios",robots:{index:false,follow:false}};
export default function Page(){return <AdminGuard><main><section className="section"><div className="container"><div className="eyebrow">Panel administrador</div><h1>Gestión de Recordatorios</h1><AdminReminders/></div></section></main></AdminGuard>}
