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
## Cambios v2 solicitados

- Se cambió la ubicación visible a **Santiago / San Miguel**.
- Se incorporaron imágenes pequeñas en cada servicio.
- Se corrigió el contraste visual de los 4 bloques en la sección de experiencia profesional.
- Se agregó imagen genérica en la sección de bienestar integral.

## Cambios v3 solicitados

- Se reemplazó la imagen principal de portada por la nueva fotografía del equipo cargada.
- Se mantuvo la ubicación visible como **Santiago / San Miguel**.
- Se mantuvieron los cambios anteriores: imágenes por servicio, sección de bienestar con imagen y contraste corregido en bloques oscuros.
- v10: Se actualizó la imagen del servicio Masaje Craneal usando el archivo entregado, manteniendo tamaño original 146x130 px.
- v11: Se actualizó la imagen del servicio Masaje para Bruxismo usando el archivo entregado, manteniendo tamaño original 137x135 px.
- v12: Se reemplazó nuevamente la imagen del servicio Masaje para Bruxismo, manteniendo tamaño original 141x134 px.
- v13: Se actualizó la imagen del servicio Masaje Linfático, manteniendo tamaño original 109x105 px.
- v14: Corrección de estructura para despliegue Vercel. Se agregó script `vercel-build` y se verificó que `app/` quede en la raíz del ZIP.
- v15: Se actualizó la imagen del servicio Masaje para Parálisis Facial, manteniendo tamaño original 137x135 px.
- v16: Se actualizó la imagen del servicio Masaje Reductivo, manteniendo tamaño original 136x115 px.
- v17: Se actualizó la imagen de la sección Bienestar integral, manteniendo tamaño original 134x104 px.
- v18: Se reemplazó completa la sección Bienestar integral por la imagen entregada, conservando proporción original 1122x1402 px.
- v19: Se eliminaron los KPIs superiores de servicios/agenda/recordatorios/solicitud online; se agregó el servicio 'Otros' con descripción 'Consulta por otros masajes específicos'; y se eliminó la sección de blog/newsletter de la página principal.
- v20: Se transformó la imagen principal del equipo en un slider automático con la imagen original más 3 imágenes adicionales entregadas por el usuario.
- v21: Se reemplazó la primera imagen del slider principal por la imagen entregada.
