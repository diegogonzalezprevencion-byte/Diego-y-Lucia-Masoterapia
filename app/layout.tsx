import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsAppFloat from "../components/WhatsAppFloat";
import LeadPopup from "../components/LeadPopup";
import JsonLd from "../components/JsonLd";
import { localBusinessSchema } from "../lib/schema";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://tudominio.cl"),
  title: { default: "Umbral Corporal | Masoterapia y Bienestar", template: "%s | Umbral Corporal" },
  description: "Umbral Corporal: servicios profesionales de masoterapia, masaje relajante, descontracturante, linfático, reductivo, piedras calientes, bruxismo, piernas cansadas y bienestar corporal.",
  keywords: ["Umbral Corporal", "masoterapia", "masaje relajante", "masaje descontracturante", "drenaje linfático", "masaje reductivo", "bruxismo", "Providencia", "Santiago", "bienestar"],
  openGraph: {
    title: "Umbral Corporal | Masoterapia y Bienestar",
    description: "Agenda servicios profesionales de masoterapia y bienestar corporal.",
    type: "website",
    locale: "es_CL"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <JsonLd data={localBusinessSchema()} />
        <Navbar />
        {children}
        <LeadPopup />
        <WhatsAppFloat />
        <Footer />
      </body>
    </html>
  );
}
