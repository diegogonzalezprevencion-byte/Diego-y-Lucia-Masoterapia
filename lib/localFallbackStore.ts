export type OfertaMensualLocal = {
  id: string;
  mes: number;
  mes_nombre: string;
  titulo: string;
  servicio: string;
  descripcion: string;
  descuento_percent: number;
  accent: string;
  activo: boolean;
  created_at: string;
  updated_at?: string;
};

export type DisponibilidadLocal = {
  id: string;
  area: string;
  fecha: string;
  hora: string;
  sucursal: string;
  masoterapeuta: string;
  disponible: boolean;
  created_at: string;
};

export type ContactoLocal = {
  id: string;
  nombre: string;
  email: string;
  telefono?: string | null;
  mensaje: string;
  origen?: string | null;
  revisado: boolean;
  revisado_at?: string | null;
  created_at: string;
};

export type TestimonioLocal = {
  id: string;
  nombre: string;
  edad?: number | null;
  servicio_realizado?: string | null;
  comentario: string;
  categoria: string;
  activo: boolean;
  created_at: string;
};

export type ReservaLocal = {
  id: string;
  area: string;
  servicio: string;
  fecha: string;
  hora: string;
  sucursal: string;
  masoterapeuta: string;
  nombre: string;
  email: string;
  telefono: string;
  comentarios?: string;
  estado: "pendiente" | "confirmada" | "cancelada";
  recordatorio_24h_enviado: boolean;
  recordatorio_dia_enviado: boolean;
  ultimo_recordatorio_at?: string | null;
  created_at: string;
};

type UmbralLocalStore = {
  ofertas_mensuales: OfertaMensualLocal[];
  disponibilidad: DisponibilidadLocal[];
  reservas: ReservaLocal[];
  contactos: ContactoLocal[];
  testimonios: TestimonioLocal[];
};

const globalForStore = globalThis as typeof globalThis & {
  __umbralLocalStore?: UmbralLocalStore;
};

export const localFallbackWarning =
  "Modo temporal sin Supabase: la disponibilidad y las reservas pueden funcionar para pruebas, pero no son persistentes. Para producción configura NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en Vercel.";

export function getLocalStore() {
  if (!globalForStore.__umbralLocalStore) {
    globalForStore.__umbralLocalStore = {
      ofertas_mensuales: [],
      disponibilidad: [],
      reservas: [],
      contactos: [],
      testimonios: []
    };
  }
  return globalForStore.__umbralLocalStore;
}

export function createLocalId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function sortByDateAndTime<T extends { fecha: string; hora: string }>(items: T[]) {
  return [...items].sort((a, b) => `${a.fecha} ${a.hora}`.localeCompare(`${b.fecha} ${b.hora}`));
}
