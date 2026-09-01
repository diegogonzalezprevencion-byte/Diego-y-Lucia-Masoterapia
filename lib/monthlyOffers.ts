export type MonthlyOffer = {
  id?: string;
  mes: number;
  mes_nombre: string;
  titulo: string;
  servicio: string;
  descripcion: string;
  descuento_percent: number;
  accent: string;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
};

export const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre"
];

export const DEFAULT_MONTHLY_OFFERS: MonthlyOffer[] = [
  { mes: 1, mes_nombre: "Enero", titulo: "Verano sin tensión", servicio: "Masaje Relajante · Piernas Cansadas", descripcion: "Masaje de relajación o piernas cansadas con precio especial para quienes vuelven de vacaciones o están con fatiga por calor.", descuento_percent: 0, accent: "summer", activo: true },
  { mes: 2, mes_nombre: "Febrero", titulo: "Mes del amor propio", servicio: "Masaje Mixto · Regala bienestar", descripcion: "Promoción parcial 2x1 o descuento para parejas y amigos. También puede presentarse como una campaña de regalo de bienestar.", descuento_percent: 0, accent: "love", activo: true },
  { mes: 3, mes_nombre: "Marzo", titulo: "Vuelta a la rutina", servicio: "Masaje Descontracturante", descripcion: "Masaje descontracturante con enfoque en cuello, espalda y hombros para aliviar el estrés laboral y la tensión del regreso a la rutina.", descuento_percent: 0, accent: "routine", activo: true },
  { mes: 4, mes_nombre: "Abril", titulo: "Renueva tu energía", servicio: "Pack de 3 sesiones", descripcion: "Pack de 3 sesiones con descuento para empezar el otoño con bienestar corporal y una rutina de autocuidado.", descuento_percent: 0, accent: "energy", activo: true },
  { mes: 5, mes_nombre: "Mayo", titulo: "Especial mamá / cuidado femenino", servicio: "Gift Card · Masaje Relajante Premium", descripcion: "Gift card o masaje relajante premium como detalle de bienestar para el Día de la Madre.", descuento_percent: 0, accent: "care", activo: true },
  { mes: 6, mes_nombre: "Junio", titulo: "Invierno sin contracturas", servicio: "Descontracturante + piedras calientes", descripcion: "Masaje descontracturante combinado con piedras calientes o terapia de calor para aliviar tensión durante el invierno.", descuento_percent: 0, accent: "winter", activo: true },
  { mes: 7, mes_nombre: "Julio", titulo: "Pausa de mitad de año", servicio: "Masaje Relajante · Masaje Mixto", descripcion: "Pack antiestrés con masaje relajante o mixto en valor promocional para hacer una pausa reparadora.", descuento_percent: 0, accent: "pause", activo: true },
  { mes: 8, mes_nombre: "Agosto", titulo: "Agosto con 20% de descuento", servicio: "20% de descuento · Todos los masajes", descripcion: "Durante agosto, agenda cualquier tipo de masaje y recibe un 20% de descuento. El descuento se aplica automáticamente al seleccionar una fecha de agosto en la agenda. Válido solo durante agosto.", descuento_percent: 20, accent: "back", activo: true },
  { mes: 9, mes_nombre: "Septiembre", titulo: "Recupera tu cuerpo post fiestas", servicio: "Linfático · Piernas Cansadas", descripcion: "Masaje de drenaje linfático, piernas cansadas o relajación para apoyar la recuperación corporal después de celebraciones.", descuento_percent: 0, accent: "restore", activo: true },
  { mes: 10, mes_nombre: "Octubre", titulo: "Primavera en equilibrio", servicio: "Relajante + Bruxismo o Craneal", descripcion: "Combinación de masaje relajante con trabajo facial, bruxismo o masaje craneal para renovar energía en primavera.", descuento_percent: 0, accent: "spring", activo: true },
  { mes: 11, mes_nombre: "Noviembre", titulo: "Prepárate para fin de año", servicio: "Pack Preventivo 2 o 3 sesiones", descripcion: "Pack preventivo de 2 o 3 sesiones antes del aumento de carga y estrés típico de fin de año.", descuento_percent: 0, accent: "prepare", activo: true },
  { mes: 12, mes_nombre: "Diciembre", titulo: "Regala bienestar", servicio: "Gift Cards · Packs Especiales", descripcion: "Gift cards navideñas, promociones para regalar y packs especiales de fin de año para compartir bienestar.", descuento_percent: 0, accent: "gift", activo: true }
];

export function normalizeMonthlyOffer(input: Partial<MonthlyOffer> & { mes: number }): MonthlyOffer {
  const fallback = DEFAULT_MONTHLY_OFFERS.find((item) => item.mes === input.mes) || DEFAULT_MONTHLY_OFFERS[0];
  const discount = Number(input.descuento_percent ?? fallback.descuento_percent ?? 0);

  return {
    ...fallback,
    ...input,
    mes: input.mes,
    mes_nombre: input.mes_nombre || MONTH_NAMES[input.mes - 1] || fallback.mes_nombre,
    titulo: String(input.titulo ?? fallback.titulo).trim(),
    servicio: String(input.servicio ?? fallback.servicio).trim(),
    descripcion: String(input.descripcion ?? fallback.descripcion).trim(),
    descuento_percent: Number.isFinite(discount) ? Math.min(100, Math.max(0, Math.round(discount))) : 0,
    accent: String(input.accent ?? fallback.accent).trim() || fallback.accent,
    activo: input.activo !== false
  };
}

export function getChileCurrentMonth() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Santiago",
    month: "numeric"
  }).formatToParts(new Date());

  const month = Number(parts.find((part) => part.type === "month")?.value || new Date().getMonth() + 1);
  return month >= 1 && month <= 12 ? month : new Date().getMonth() + 1;
}

export function getCurrentAndNextMonthNumbers() {
  const current = getChileCurrentMonth();
  const next = current === 12 ? 1 : current + 1;
  return [current, next];
}

export function sortOffersByMonthList(offers: MonthlyOffer[], months: number[]) {
  return [...offers].sort((a, b) => months.indexOf(a.mes) - months.indexOf(b.mes));
}

export function mergeWithDefaultOffers(offers: MonthlyOffer[]) {
  const byMonth = new Map<number, MonthlyOffer>();
  for (const offer of DEFAULT_MONTHLY_OFFERS) byMonth.set(offer.mes, offer);
  for (const offer of offers) byMonth.set(offer.mes, normalizeMonthlyOffer(offer));
  return Array.from(byMonth.values()).sort((a, b) => a.mes - b.mes);
}
