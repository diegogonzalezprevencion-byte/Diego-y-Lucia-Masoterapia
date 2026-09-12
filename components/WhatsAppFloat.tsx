import { buildWhatsAppUrl } from "../lib/whatsapp";

export default function WhatsAppFloat() {
  const message = "Hola, quiero solicitar información sobre los servicios de Umbral Corporal.";
  return <a className="whatsapp-float" href={buildWhatsAppUrl(message)} target="_blank" rel="noopener noreferrer">WhatsApp</a>;
}
