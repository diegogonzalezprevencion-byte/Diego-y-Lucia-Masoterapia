# Diego Masoterapia Web

Versión separada solo para servicios profesionales de Masoterapia.

## Enfoque

Sitio web independiente para promoción, reserva y gestión de servicios de masoterapia, bienestar corporal, relajación, autocuidado, hábitos saludables y agenda online.

## Incluye

- Home exclusiva de masoterapia.
- Calendario de autoagenda en la página principal.
- Página de agenda de masoterapia.
- Servicios y precios referenciales para Providencia/Santiago.
- Blog SEO de bienestar y masoterapia.
- Landing pages SEO locales:
  - `/masoterapia-santiago`
  - `/masoterapia-providencia`
  - `/masoterapia-las-condes`
- Leads.
- Newsletter.
- Testimonios.
- Galería.
- Dashboard administrativo.
- Reservas.
- Disponibilidad.
- Recordatorios.
- Preparación de pagos.
- Preparación Google Calendar.
- Supabase ampliado.

## Rutas principales

- `/`
- `/agenda-masoterapia`
- `/blog`
- `/contacto`
- `/newsletter`
- `/politicas`
- `/admin`

## Servicios incluidos

- Masaje relajante
- Masaje descontracturante
- Masaje mixto
- Masaje con piedras calientes
- Masaje para piernas cansadas
- Masaje craneal
- Masaje para bruxismo
- Masaje para parálisis facial
- Masaje linfático
- Masaje reductivo

## Nota importante

Los servicios de masoterapia son de bienestar y apoyo corporal. No reemplazan atención médica, kinesiológica, odontológica ni tratamientos indicados por profesionales de salud. Para bruxismo, parálisis facial, dolor intenso, lesiones, inflamación, embarazo, cirugías recientes o condiciones médicas, se recomienda consultar previamente con un profesional de salud.

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

Ejecuta `supabase/schema.sql`.

## Vercel

- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: dejar vacío
