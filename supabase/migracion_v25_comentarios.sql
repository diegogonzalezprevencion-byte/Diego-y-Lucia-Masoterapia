alter table if exists public.reservas add column if not exists comentarios text;
notify pgrst, 'reload schema';
