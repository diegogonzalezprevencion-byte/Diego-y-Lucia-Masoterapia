-- Migración v36 - Ofertas mensuales editables
-- Ejecutar una sola vez en Supabase > SQL Editor > New query > Run.

create extension if not exists pgcrypto;

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

alter table public.ofertas_mensuales enable row level security;

drop policy if exists "Permitir lectura ofertas activas" on public.ofertas_mensuales;
create policy "Permitir lectura ofertas activas" on public.ofertas_mensuales
for select to anon
using (activo = true);

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
