import AdminGuard from "../../../components/AdminGuard";
import AdminTestimonials from "../../../components/AdminTestimonials";
export const metadata={title:"Gestión de Testimonios",robots:{index:false,follow:false}};
export default function Page(){return <AdminGuard><main><section className="section"><div className="container"><div className="eyebrow">Panel administrador</div><h1>Gestión de Testimonios</h1><AdminTestimonials/></div></section></main></AdminGuard>}
