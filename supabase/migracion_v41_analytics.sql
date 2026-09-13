-- Migración v41 - Analítica web Umbral Corporal
-- Ejecutar una sola vez en Supabase > SQL Editor > New query > Run.

create extension if not exists pgcrypto;

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (event_type in ('page_view', 'click')),
  visitor_id text,
  session_id text,
  path text,
  page_title text,
  referrer text,
  element_text text,
  element_tag text,
  element_href text,
  element_id text,
  element_classes text,
  screen_width integer,
  screen_height integer,
  language text,
  user_agent text,
  country text,
  city text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  created_at timestamp with time zone default now()
);

create index if not exists analytics_events_created_at_idx on public.analytics_events (created_at desc);
create index if not exists analytics_events_event_type_idx on public.analytics_events (event_type);
create index if not exists analytics_events_path_idx on public.analytics_events (path);
create index if not exists analytics_events_visitor_idx on public.analytics_events (visitor_id);
create index if not exists analytics_events_session_idx on public.analytics_events (session_id);

alter table public.analytics_events enable row level security;

-- No se crea política pública de lectura.
-- La web registra eventos desde /api/analytics usando SERVICE_ROLE_KEY.
-- El dashboard lee estadísticas desde /api/admin/dashboard usando SERVICE_ROLE_KEY.

notify pgrst, 'reload schema';
