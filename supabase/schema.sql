create table if not exists public.reservas (
  id uuid primary key default gen_random_uuid(),
  area text not null check (area in ('masoterapia')),
  servicio text not null,
  fecha date not null,
  hora text not null,
  sucursal text not null default 'Santiago Centro',
  masoterapeuta text not null default 'Diego González',
  nombre text not null,
  email text not null,
  telefono text not null,
  comentarios text,
  estado text not null default 'pendiente' check (estado in ('pendiente', 'confirmada', 'cancelada')),
  recordatorio_24h_enviado boolean not null default false,
  recordatorio_dia_enviado boolean not null default false,
  ultimo_recordatorio_at timestamp with time zone,
  created_at timestamp with time zone default now()
);


alter table if exists public.reservas add column if not exists recordatorio_24h_enviado boolean not null default false;
alter table if exists public.reservas add column if not exists recordatorio_dia_enviado boolean not null default false;
alter table if exists public.reservas add column if not exists ultimo_recordatorio_at timestamp with time zone;
alter table if exists public.reservas add column if not exists comentarios text;
alter table if exists public.reservas add column if not exists sucursal text not null default 'Santiago Centro';
alter table if exists public.reservas add column if not exists masoterapeuta text not null default 'Diego González';

alter table if exists public.disponibilidad add column if not exists sucursal text not null default 'Santiago Centro';
alter table if exists public.disponibilidad add column if not exists masoterapeuta text not null default 'Diego González';
alter table if exists public.disponibilidad drop constraint if exists disponibilidad_area_fecha_hora_key;
alter table if exists public.disponibilidad drop constraint if exists disponibilidad_area_fecha_hora_sucursal_masoterapeuta_key;
alter table if exists public.disponibilidad add constraint disponibilidad_area_fecha_hora_sucursal_masoterapeuta_key unique (area, fecha, hora, sucursal, masoterapeuta);

alter table if exists public.testimonios add column if not exists edad integer;
alter table if exists public.testimonios add column if not exists servicio_realizado text;


create table if not exists public.ofertas_mensuales (
  id uuid primary key default gen_random_uuid(),
  mes integer not null unique check (mes between 1 and 12),
  mes_nombre text not null,
  titulo text not null,
  servicio text not null,
  descripcion text not null,
  descuento_percent integer not null default 0 check (descuento_percent between 0 and 100),
  accent text not null default 'routine',
  activo boolean not null default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);


create table if not exists public.disponibilidad (
  id uuid primary key default gen_random_uuid(),
  area text not null check (area in ('masoterapia')),
  fecha date not null,
  hora text not null,
  sucursal text not null default 'Santiago Centro',
  masoterapeuta text not null default 'Diego González',
  disponible boolean not null default true,
  created_at timestamp with time zone default now(),
  unique (area, fecha, hora, sucursal, masoterapeuta)
);


create table if not exists public.contactos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  email text not null,
  telefono text,
  mensaje text not null,
  origen text default 'web',
  revisado boolean not null default false,
  revisado_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

create table if not exists public.testimonios (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  edad integer,
  servicio_realizado text,
  comentario text not null,
  categoria text not null default 'masoterapia',
  activo boolean not null default true,
  created_at timestamp with time zone default now()
);



create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  nombre text,
  email text,
  telefono text,
  interes text,
  origen text default 'web',
  created_at timestamp with time zone default now()
);

create table if not exists public.pagos (
  id uuid primary key default gen_random_uuid(),
  reserva_id uuid references public.reservas(id) on delete set null,
  monto integer,
  estado text default 'pendiente',
  metodo text,
  created_at timestamp with time zone default now()
);

alter table public.ofertas_mensuales enable row level security;
alter table public.reservas enable row level security;
alter table public.disponibilidad enable row level security;
alter table public.contactos enable row level security;
alter table public.testimonios enable row level security;
alter table public.leads enable row level security;
alter table public.pagos enable row level security;

drop policy if exists "Permitir lectura ofertas activas" on public.ofertas_mensuales;
create policy "Permitir lectura ofertas activas" on public.ofertas_mensuales for select to anon using (activo = true);

drop policy if exists "Permitir insertar reservas publicas" on public.reservas;
create policy "Permitir insertar reservas publicas" on public.reservas for insert to anon with check (true);

drop policy if exists "Permitir lectura disponibilidad publica" on public.disponibilidad;
create policy "Permitir lectura disponibilidad publica" on public.disponibilidad for select to anon using (true);

drop policy if exists "Permitir insertar contactos publicos" on public.contactos;
create policy "Permitir insertar contactos publicos" on public.contactos for insert to anon with check (true);

drop policy if exists "Permitir lectura testimonios publicos" on public.testimonios;
create policy "Permitir lectura testimonios publicos" on public.testimonios for select to anon using (activo = true);



insert into public.testimonios (nombre, edad, servicio_realizado, comentario, categoria, activo)
values
('Cliente Particular', null, 'Masaje relajante', 'Atención muy profesional, clara y cuidadosa. Excelente sesión de masoterapia.', 'masoterapia', true),
('Cliente Bienestar', null, 'Masaje descontracturante', 'El masaje descontracturante me ayudó mucho a disminuir tensión muscular.', 'masoterapia', true)
on conflict do nothing;




insert into public.disponibilidad (area, fecha, hora, disponible)
values
('masoterapia', current_date + interval '1 day', '09:00', true),
('masoterapia', current_date + interval '1 day', '10:00', true),
('masoterapia', current_date + interval '1 day', '11:00', true),
('masoterapia', current_date + interval '1 day', '12:00', true),
('masoterapia', current_date + interval '1 day', '13:00', true),
('masoterapia', current_date + interval '1 day', '14:00', true),
('masoterapia', current_date + interval '1 day', '15:00', true),
('masoterapia', current_date + interval '1 day', '16:00', true),
('masoterapia', current_date + interval '1 day', '17:00', true),
('masoterapia', current_date + interval '1 day', '18:00', true),
('masoterapia', current_date + interval '1 day', '19:00', true),
('masoterapia', current_date + interval '1 day', '20:00', true),
('masoterapia', current_date + interval '1 day', '21:00', true),
('masoterapia', current_date + interval '2 days', '09:00', true),
('masoterapia', current_date + interval '2 days', '10:00', true),
('masoterapia', current_date + interval '2 days', '11:00', true),
('masoterapia', current_date + interval '2 days', '12:00', true),
('masoterapia', current_date + interval '2 days', '13:00', true),
('masoterapia', current_date + interval '2 days', '14:00', true),
('masoterapia', current_date + interval '2 days', '15:00', true),
('masoterapia', current_date + interval '2 days', '16:00', true),
('masoterapia', current_date + interval '2 days', '17:00', true),
('masoterapia', current_date + interval '2 days', '18:00', true),
('masoterapia', current_date + interval '2 days', '19:00', true),
('masoterapia', current_date + interval '2 days', '20:00', true),
('masoterapia', current_date + interval '2 days', '21:00', true)
on conflict (area, fecha, hora) do nothing;
create table if not exists public.newsletter (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  nombre text,
  interes text not null default 'general',
  activo boolean not null default true,
  created_at timestamp with time zone default now(),
  unique(email, interes)
);

create table if not exists public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  reserva_id uuid references public.reservas(id) on delete set null,
  google_event_id text,
  estado text not null default 'preparado',
  payload jsonb,
  created_at timestamp with time zone default now()
);

alter table public.newsletter enable row level security;
alter table public.calendar_events enable row level security;

drop policy if exists "Permitir insertar newsletter publico" on public.newsletter;
create policy "Permitir insertar newsletter publico" on public.newsletter for insert to anon with check (true);

drop policy if exists "Permitir insertar leads publicos" on public.leads;
create policy "Permitir insertar leads publicos" on public.leads for insert to anon with check (true);

insert into public.ofertas_mensuales (mes, mes_nombre, titulo, servicio, descripcion, descuento_percent, accent, activo)
values
(1, 'Enero', 'Verano sin tensión', 'Masaje Relajante · Piernas Cansadas', 'Masaje de relajación o piernas cansadas con precio especial para quienes vuelven de vacaciones o están con fatiga por calor.', 0, 'summer', true),
(2, 'Febrero', 'Mes del amor propio', 'Masaje Mixto · Regala bienestar', 'Promoción parcial 2x1 o descuento para parejas y amigos. También puede presentarse como una campaña de regalo de bienestar.', 0, 'love', true),
(3, 'Marzo', 'Vuelta a la rutina', 'Masaje Descontracturante', 'Masaje descontracturante con enfoque en cuello, espalda y hombros para aliviar el estrés laboral y la tensión del regreso a la rutina.', 0, 'routine', true),
(4, 'Abril', 'Renueva tu energía', 'Pack de 3 sesiones', 'Pack de 3 sesiones con descuento para empezar el otoño con bienestar corporal y una rutina de autocuidado.', 0, 'energy', true),
(5, 'Mayo', 'Especial mamá / cuidado femenino', 'Gift Card · Masaje Relajante Premium', 'Gift card o masaje relajante premium como detalle de bienestar para el Día de la Madre.', 0, 'care', true),
(6, 'Junio', 'Invierno sin contracturas', 'Descontracturante + piedras calientes', 'Masaje descontracturante combinado con piedras calientes o terapia de calor para aliviar tensión durante el invierno.', 0, 'winter', true),
(7, 'Julio', 'Pausa de mitad de año', 'Masaje Relajante · Masaje Mixto', 'Pack antiestrés con masaje relajante o mixto en valor promocional para hacer una pausa reparadora.', 0, 'pause', true),
(8, 'Agosto', 'Agosto con 20% de descuento', '20% de descuento · Todos los masajes', 'Durante agosto, agenda cualquier tipo de masaje y recibe un 20% de descuento. El descuento se aplica automáticamente al seleccionar una fecha de agosto en la agenda. Válido solo durante agosto.', 20, 'back', true),
(9, 'Septiembre', 'Recupera tu cuerpo post fiestas', 'Linfático · Piernas Cansadas', 'Masaje de drenaje linfático, piernas cansadas o relajación para apoyar la recuperación corporal después de celebraciones.', 0, 'restore', true),
(10, 'Octubre', 'Primavera en equilibrio', 'Relajante + Bruxismo o Craneal', 'Combinación de masaje relajante con trabajo facial, bruxismo o masaje craneal para renovar energía en primavera.', 0, 'spring', true),
(11, 'Noviembre', 'Prepárate para fin de año', 'Pack Preventivo 2 o 3 sesiones', 'Pack preventivo de 2 o 3 sesiones antes del aumento de carga y estrés típico de fin de año.', 0, 'prepare', true),
(12, 'Diciembre', 'Regala bienestar', 'Gift Cards · Packs Especiales', 'Gift cards navideñas, promociones para regalar y packs especiales de fin de año para compartir bienestar.', 0, 'gift', true)
on conflict (mes) do nothing;


notify pgrst, 'reload schema';
