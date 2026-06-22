export function buildWhatsAppUrl(message: string) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "56912345678";
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function reservationWhatsAppMessage(data: { nombre: string; area: string; servicio: string; fecha: string; hora: string; }) {
  return `Hola, soy ${data.nombre}. Solicité una reserva para ${data.area}: ${data.servicio}, el día ${data.fecha} a las ${data.hora}. Quisiera confirmar disponibilidad.`;
}

export function reminder24hMessage(data: { nombre: string; area: string; servicio: string; fecha: string; hora: string; }) {
  return `Hola ${data.nombre}, te recordamos tu reserva de ${data.area}: ${data.servicio}, programada para mañana ${data.fecha} a las ${data.hora}. Por favor confirma tu asistencia.`;
}

export function reminderSameDayMessage(data: { nombre: string; area: string; servicio: string; fecha: string; hora: string; }) {
  return `Hola ${data.nombre}, hoy tienes tu reserva de ${data.area}: ${data.servicio}, a las ${data.hora}. Te esperamos.`;
}
