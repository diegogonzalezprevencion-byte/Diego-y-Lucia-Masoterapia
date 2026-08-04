export function buildWhatsAppUrl(message: string) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "56950257518";
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

type ReservationMessageData = {
  nombre: string;
  area: string;
  servicio: string;
  fecha: string;
  hora: string;
  comentarios?: string;
};

export function reservationWhatsAppMessage(data: ReservationMessageData) {
  const comments = data.comentarios?.trim()
    ? `\nComentarios: ${data.comentarios.trim()}`
    : "";
  return `Hola, soy ${data.nombre}. Solicité una reserva para ${data.area}: ${data.servicio}, el día ${data.fecha} a las ${data.hora}. Quisiera confirmar disponibilidad.${comments}`;
}

export function reminder24hMessage(data: { nombre: string; area: string; servicio: string; fecha: string; hora: string; }) {
  return `Hola ${data.nombre}, te recordamos tu reserva de ${data.area}: ${data.servicio}, programada para mañana ${data.fecha} a las ${data.hora}. Por favor confirma tu asistencia.`;
}

export function reminderSameDayMessage(data: { nombre: string; area: string; servicio: string; fecha: string; hora: string; }) {
  return `Hola ${data.nombre}, hoy tienes tu reserva de ${data.area}: ${data.servicio}, a las ${data.hora}. Te esperamos.`;
}
