-- Migración v29 - Sucursales, masoterapeutas, agenda diferenciada y testimonios simplificados
-- Ejecutar una sola vez en Supabase > SQL Editor > New query > Run.

alter table if exists public.reservas
add column if not exists sucursal text not null default 'Santiago Centro';

alter table if exists public.reservas
add column if not exists masoterapeuta text not null default 'Diego González';

alter table if exists public.disponibilidad
add column if not exists sucursal text not null default 'Santiago Centro';

alter table if exists public.disponibilidad
add column if not exists masoterapeuta text not null default 'Diego González';

-- Permite tener horarios distintos para cada sucursal y cada masoterapeuta.
alter table if exists public.disponibilidad
drop constraint if exists disponibilidad_area_fecha_hora_key;

alter table if exists public.disponibilidad
drop constraint if exists disponibilidad_area_fecha_hora_sucursal_masoterapeuta_key;

alter table if exists public.disponibilidad
add constraint disponibilidad_area_fecha_hora_sucursal_masoterapeuta_key
unique (area, fecha, hora, sucursal, masoterapeuta);

alter table if exists public.testimonios
add column if not exists edad integer;

alter table if exists public.testimonios
add column if not exists servicio_realizado text;

notify pgrst, 'reload schema';
