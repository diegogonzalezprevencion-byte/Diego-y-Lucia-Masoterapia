const DEFAULT_BUSINESS_WHATSAPP = "56950257518";

export function normalizeWhatsAppNumber(value?: string | null) {
  const raw = (value || "").toString().trim();
  if (!raw) return DEFAULT_BUSINESS_WHATSAPP;

  let digits = raw.replace(/\D/g, "");

  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = digits.slice(1);

  // Si es número chileno de 9 dígitos móvil, anteponer 56.
  if (digits.length === 9 && digits.startsWith("9")) digits = `56${digits}`;

  return digits || DEFAULT_BUSINESS_WHATSAPP;
}

export function buildWhatsAppUrl(message: string) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || DEFAULT_BUSINESS_WHATSAPP;
  return buildWhatsAppUrlForNumber(number, message);
}

export function buildWhatsAppUrlForNumber(number: string | undefined | null, message: string) {
  return `https://wa.me/${normalizeWhatsAppNumber(number)}?text=${encodeURIComponent(message)}`;
}

type ReservationMessageData = {
  nombre: string;
  area: string;
  servicio: string;
  fecha: string;
  hora: string;
  sucursal?: string;
  masoterapeuta?: string;
  comentarios?: string;
};

export function reservationWhatsAppMessage(data: ReservationMessageData) {
  const branch = data.sucursal ? `\nSucursal: ${data.sucursal}` : "";
  const therapist = data.masoterapeuta ? `\nMasoterapeuta: ${data.masoterapeuta}` : "";
  const comments = data.comentarios?.trim()
    ? `\nComentarios: ${data.comentarios.trim()}`
    : "";
  return `Hola, soy ${data.nombre}. Solicité una reserva para ${data.area}: ${data.servicio}, el día ${data.fecha} a las ${data.hora}.${branch}${therapist}\nQuisiera confirmar disponibilidad.${comments}`;
}

const ANAMNESIS_URL = "https://forms.gle/T5EzAJLUsmfUsLSW6";

export function formatDateForClient(value?: string | null) {
  if (!value) return "fecha no informada";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${day}-${month}-${year}`;
}

export function reminderScheduledMessage(data: { nombre: string; area: string; servicio: string; fecha: string; hora: string; sucursal?: string; masoterapeuta?: string; }) {
  const branch = data.sucursal ? ` en ${data.sucursal}` : "";
  const therapist = data.masoterapeuta ? ` con ${data.masoterapeuta}` : "";
  const formattedDate = formatDateForClient(data.fecha);
  return `Hola ${data.nombre}, te recordamos tu reserva de ${data.area}: ${data.servicio}${branch}${therapist}, programada para el día ${formattedDate} a las ${data.hora}. Por favor confirma tu asistencia. Además, te invitamos a completar la anamnesis previa para la prestación del servicio en el siguiente link: ${ANAMNESIS_URL}`;
}

export function reminder24hMessage(data: { nombre: string; area: string; servicio: string; fecha: string; hora: string; sucursal?: string; masoterapeuta?: string; }) {
  return reminderScheduledMessage(data);
}

export function reminderSameDayMessage(data: { nombre: string; area: string; servicio: string; fecha: string; hora: string; sucursal?: string; masoterapeuta?: string; }) {
  const branch = data.sucursal ? ` en ${data.sucursal}` : "";
  const therapist = data.masoterapeuta ? ` con ${data.masoterapeuta}` : "";
  const formattedDate = formatDateForClient(data.fecha);
  return `Hola ${data.nombre}, te recordamos que hoy ${formattedDate} tienes tu reserva de ${data.area}: ${data.servicio}${branch}${therapist}, a las ${data.hora}. Te esperamos. Si aún no lo has realizado, completa la anamnesis previa para la prestación del servicio en el siguiente link: ${ANAMNESIS_URL}`;
}

