create table if not exists public.reservas (
  id uuid primary key default gen_random_uuid(),
  area text not null check (area in ('masoterapia')),
  servicio text not null,
  fecha date not null,
  hora text not null,
  nombre text not null,
  email text not null,
  telefono text not null,
  estado text not null default 'pendiente' check (estado in ('pendiente', 'confirmada', 'cancelada')),
  recordatorio_24h_enviado boolean not null default false,
  recordatorio_dia_enviado boolean not null default false,
  ultimo_recordatorio_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

alter table if exists public.reservas add column if not exists recordatorio_24h_enviado boolean not null default false;
alter table if exists public.reservas add column if not exists recordatorio_dia_enviado boolean not null default false;
alter table if exists public.reservas add column if not exists ultimo_recordatorio_at timestamp with time zone;

create table if not exists public.disponibilidad (
  id uuid primary key default gen_random_uuid(),
  area text not null check (area in ('masoterapia')),
  fecha date not null,
  hora text not null,
  disponible boolean not null default true,
  created_at timestamp with time zone default now(),
  unique (area, fecha, hora)
);

create table if not exists public.contactos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  email text not null,
  telefono text,
  mensaje text not null,
  origen text default 'web',
  created_at timestamp with time zone default now()
);

create table if not exists public.testimonios (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  cargo text,
  empresa text,
  comentario text not null,
  categoria text not null check (categoria in   activo boolean not null default true,
  created_at timestamp with time zone default now()
);

create table if not exists public.galeria (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descripcion text,
  categoria text not null check (categoria in   imagen_url text,
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

alter table public.reservas enable row level security;
alter table public.disponibilidad enable row level security;
alter table public.contactos enable row level security;
alter table public.testimonios enable row level security;
alter table public.galeria enable row level security;
alter table public.leads enable row level security;
alter table public.pagos enable row level security;

drop policy if exists "Permitir insertar reservas publicas" on public.reservas;
create policy "Permitir insertar reservas publicas" on public.reservas for insert to anon with check (true);

drop policy if exists "Permitir lectura disponibilidad publica" on public.disponibilidad;
create policy "Permitir lectura disponibilidad publica" on public.disponibilidad for select to anon using (true);

drop policy if exists "Permitir insertar contactos publicos" on public.contactos;
create policy "Permitir insertar contactos publicos" on public.contactos for insert to anon with check (true);

drop policy if exists "Permitir lectura testimonios publicos" on public.testimonios;
create policy "Permitir lectura testimonios publicos" on public.testimonios for select to anon using (activo = true);

drop policy if exists "Permitir lectura galeria publica" on public.galeria;
create policy "Permitir lectura galeria publica" on public.galeria for select to anon using (activo = true);


insert into public.testimonios (nombre, cargo, empresa, comentario, categoria, activo)
values
('Cliente Particular', 'Paciente', '', 'Atención muy profesional, clara y cuidadosa. Excelente sesión de masoterapia.', 'masoterapia', true),
('Cliente Bienestar', 'Paciente', '', 'El masaje descontracturante me ayudó mucho a disminuir tensión muscular.', 'masoterapia', true)
on conflict do nothing;



insert into public.galeria (titulo, descripcion, categoria, imagen_url, activo)
values
('Box de masoterapia', 'Espacio para fotografía de camilla, ambiente, aromas y equipamiento.', 'masoterapia', '', true),
('Ambiente de relajación', 'Espacio para fotografía del lugar de atención y experiencia de bienestar.', 'masoterapia', '', true)
on conflict do nothing;


insert into public.disponibilidad (area, fecha, hora, disponible)
values
('masoterapia', current_date + interval '1 day', '12:00', true),
('masoterapia', current_date + interval '1 day', '17:00', true),
('masoterapia', current_date + interval '2 days', '18:00', true)
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
