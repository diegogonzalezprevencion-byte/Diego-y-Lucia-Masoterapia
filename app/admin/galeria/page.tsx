import AdminGuard from "../../../components/AdminGuard";
import AdminGallery from "../../../components/AdminGallery";
export const metadata={title:"Gestión de Galería",robots:{index:false,follow:false}};
export default function Page(){return <AdminGuard><main><section className="section"><div className="container"><div className="eyebrow">Panel administrador</div><h1>Gestión de Galería</h1><AdminGallery/></div></section></main></AdminGuard>}
