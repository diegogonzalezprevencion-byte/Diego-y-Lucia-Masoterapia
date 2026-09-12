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
- v22: Se incorporó una nueva sección tipo slide sobre la autoagenda principal, con calendario de Enero a Diciembre y campañas/ofertas mensuales de masoterapia.
- v23: Se corrigió el calendario de ofertas para que los meses sean clickeables y se rediseñó el slide con colores, formas decorativas y tarjetas más dinámicas.
- v24: Se corrigió el bloqueo por variables de Supabase faltantes. La agenda/admin ahora tiene un modo temporal de prueba si Supabase no está configurado, y se reforzó la documentación de variables de entorno para producción.

## Cambios v25
- Horarios de reserva y administración ampliados de 09:00 a 21:00 en bloques de 1 hora.
- Datos de contacto incorpora comentarios sobre el servicio requerido.
- WhatsApp actualizado a +56950257518.
- Admin retirado del menú público y protegido con Usuario1/lucialorca y Usuario2/diegogonzalez.
- Panel Admin simplificado: se retiraron accesos a Leads, Newsletter, Pagos y Google Calendar.
- Supabase incluye migración `supabase/migracion_v25_comentarios.sql` para guardar comentarios en reservas existentes.
- v26: Se corrigió la gestión de disponibilidad para controlar cada bloque horario de 09:00 a 21:00 por fecha. Los horarios desactivados ya no aparecen en la reserva pública y se repuso el acceso Admin en el menú con login controlado.
- v27: Se corrigió el desfase de fecha entre administración y reserva pública. Ahora ambas vistas usan fecha local YYYY-MM-DD, evitando que el cliente consulte un día distinto al activado en Admin. También se forzó consulta sin caché para reflejar cambios de disponibilidad inmediatamente.
- v28: Se agregaron correos automáticos. Al crear una reserva se notifica a Umbral.corporal@gmail.com. Al confirmar una reserva desde Admin se envía correo al cliente. También se mejoró el feedback de los botones Confirmar/Pendiente/Cancelar.
- v29: Se agregó agenda por sucursal y masoterapeuta, calendario móvil de 62 días, WhatsApp de recordatorios hacia el cliente, ajustes responsive móvil, servicio de piedras calientes renombrado y testimonios simplificados.
- v30: Se ajustó la visualización móvil para evitar desbordes en agenda, formularios, tarjetas y botones. El calendario de agenda se redujo de 2 meses a 30 días móviles.
- v31: Se corrigió específicamente la sección Reserva de Masoterapia en teléfonos: títulos y textos ahora se ajustan al ancho, formularios no se cortan, el calendario de 30 días se muestra en grilla móvil y se oculta el botón flotante de WhatsApp para que no tape el formulario.
- v32: Se actualizó la oferta de agosto a 20% de descuento en cualquier tipo de masaje. Al seleccionar una fecha de agosto en la agenda, el resumen calcula y muestra automáticamente precio normal, descuento y total con descuento. La reserva guarda la información promocional dentro del campo servicio, sin requerir cambios nuevos en Supabase.
- v33: Se agregó Gestión de Contactos en Admin con estado Revisado/No revisado. Se compactó la tabla de reservas para reducir el uso de desplazamiento horizontal. Se corrigieron mensajes de recordatorios con fecha DD-MM-YYYY, link de anamnesis y filtro/columna de masoterapeuta.
- v34: Gestión de Reservas ahora ordena de más nuevo a más antiguo y agrega filtros por columna. Gestión de Contactos y Recordatorios quedan homologadas al tamaño compacto de Reservas. En Recordatorios se eliminó la columna Tipo, se redujo el botón WhatsApp y se actualizó el link de anamnesis.
- v35: Se agregó una sección pública de testimonios junto al calendario de ofertas. Los usuarios pueden enviar testimonios desde el botón “Deja tu testimonio”, pero quedan pendientes hasta aprobación del administrador. Admin > Testimonios ahora permite aceptar/publicar, ocultar, modificar y eliminar testimonios.
- v36: Ofertas públicas limitadas al mes en curso + mes siguiente, con nueva administración de ofertas mensuales. Se eliminó Galería del panel administrador. Se compactó Nuestros servicios y se unificó Proceso de atención con Bienestar integral, reduciendo el afiche aproximadamente al 50%.
