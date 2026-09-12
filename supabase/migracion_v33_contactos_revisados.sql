-- Migración v33 - Contactos revisados
-- Ejecutar una sola vez en Supabase > SQL Editor > New query > Run.

alter table if exists public.contactos
add column if not exists revisado boolean not null default false;

alter table if exists public.contactos
add column if not exists revisado_at timestamp with time zone;

notify pgrst, 'reload schema';
