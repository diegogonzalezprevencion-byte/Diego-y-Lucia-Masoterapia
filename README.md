# Umbral Corporal – App Web de Masoterapia

Versión lista para GitHub y Vercel, basada en la app de masoterapia ya trabajada, ahora con identidad visual de **Umbral Corporal**.

## Cambios principales

- Marca actualizada a **Umbral Corporal**.
- Logo institucional incorporado.
- Fotografía del equipo incorporada en portada.
- Colores relajantes y más coherentes con bienestar.
- Autoagenda directamente en la página principal.
- Servicios y precios referenciales para Providencia/Santiago.
- Blog de masoterapia y bienestar.
- Newsletter.
- Leads.
- Panel administrador.
- Testimonios.
- Galería.
- Recordatorios.
- Preparación de pagos.
- Preparación Google Calendar.
- Supabase.

## Archivos importantes

- `ROADMAP_UMBRAL_CORPORAL.md`: fases escritas del rediseño.
- `public/logo-umbral-corporal.png`: logo institucional.
- `public/equipo-umbral-corporal.jpg`: fotografía del equipo.
- `public/equipo-umbral-hero.jpg`: versión tratada para portada.

## Rutas principales

- `/`
- `/agenda-masoterapia`
- `/blog`
- `/newsletter`
- `/contacto`
- `/politicas`
- `/admin`

## Variables de entorno Vercel

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_ADMIN_PIN`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `CONTACT_EMAIL`
- `CRON_SECRET`
- `GOOGLE_CALENDAR_ID`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`
- `PAYMENT_PROVIDER`
- `WEBPAY_COMMERCE_CODE`
- `WEBPAY_API_KEY`
- `MERCADOPAGO_ACCESS_TOKEN`

## Supabase

Ejecutar:

```sql
supabase/schema.sql
```

## Vercel

- Framework Preset: Next.js.
- Build Command: `npm run build`.
- Output Directory: dejar vacío.

## Nota sanitaria importante

Los servicios de masoterapia son de bienestar corporal y apoyo complementario. No reemplazan atención médica, kinesiológica, odontológica ni tratamientos indicados por profesionales de salud.
