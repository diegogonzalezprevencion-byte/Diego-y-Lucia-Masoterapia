# Roadmap – Umbral Corporal Masoterapia

Objetivo: transformar la app-web de masoterapia en una experiencia visual relajante, profesional y enfocada en bienestar, usando la identidad institucional de Umbral Corporal, el logo oficial, fotografía del equipo y autoagenda en la página principal.

## Fase 1: Fundación visual y rebranding

### Objetivo
Actualizar toda la identidad visual de la web para que deje de verse como “Diego Masoterapia” y pase a funcionar como una marca profesional llamada **Umbral Corporal**.

### Cambios aplicados
- Cambio de nombre superior a **Umbral Corporal**.
- Incorporación del logo institucional en navbar y portada.
- Paleta visual relajante:
  - Verde profundo.
  - Verde salvia.
  - Menta suave.
  - Fondo crema.
  - Azul verdoso de apoyo.
- Botones, tarjetas, bordes, fondos y estados visuales ajustados.
- Manifest actualizado para que la app se identifique como Umbral Corporal.

### Entregable
Base visual renovada y lista para Vercel.

---

## Fase 2: Portada renovada con equipo y agenda principal

### Objetivo
Crear una portada más humana, confiable y orientada a conversión.

### Cambios aplicados
- Foto del equipo incorporada en la portada.
- Retoque visual mediante recorte, brillo, contraste y marco de diseño.
- Hero principal con mensaje enfocado en bienestar:
  - “Bienestar que se siente, equilibrio que transforma”.
- Autoagenda visible directamente en la página principal.
- Botones principales:
  - Agendar ahora.
  - Ver servicios.
  - Contactar por WhatsApp.

### Entregable
Home con portada profesional y calendario de reserva visible.

---

## Fase 3: Servicios, precios y experiencia de usuario

### Objetivo
Mostrar los servicios de masoterapia de forma clara, atractiva y comercial.

### Servicios incluidos
- Masaje relajante.
- Masaje descontracturante.
- Masaje mixto.
- Masaje con piedras calientes.
- Masaje para piernas cansadas.
- Masaje craneal.
- Masaje para bruxismo.
- Masaje para parálisis facial.
- Masaje linfático.
- Masaje reductivo.

### Cambios aplicados
- Tarjetas de precios con valores referenciales para Providencia/Santiago.
- Descripciones orientadas a beneficios.
- Aviso prudente: la masoterapia no reemplaza atención médica, kinesiológica ni odontológica.
- CTA hacia reserva y WhatsApp.

### Entregable
Catálogo de servicios claro y orientado a conversión.

---

## Fase 4: Bienestar, confianza y contenido

### Objetivo
Fortalecer la propuesta de valor con contenido educativo y confianza profesional.

### Cambios aplicados
- Sección de bienestar integral:
  - Hidratación.
  - Descanso.
  - Alimentación equilibrada.
  - Pausas activas.
  - Autocuidado.
- Blog enfocado en masoterapia y bienestar.
- Testimonios preparados.
- Galería preparada.
- Newsletter enfocado en bienestar.

### Entregable
Web con contenido de apoyo, confianza y SEO.

---

## Fase 5: Optimización, producción y administración

### Objetivo
Mantener la app lista para uso real, administración y crecimiento futuro.

### Se mantiene
- Panel administrador.
- Reservas.
- Disponibilidad.
- Recordatorios.
- Leads.
- Newsletter.
- Pagos preparados.
- Google Calendar preparado.
- Supabase.
- SEO local.
- Sitemap.
- Robots.

### Entregable final
Web lista para GitHub y Vercel, con identidad de Umbral Corporal y foco exclusivo en masoterapia.
- v10: Se actualizó la imagen del servicio Masaje Craneal usando el archivo entregado, manteniendo tamaño original 146x130 px.
- v11: Se actualizó la imagen del servicio Masaje para Bruxismo usando el archivo entregado, manteniendo tamaño original 137x135 px.
- v12: Se reemplazó nuevamente la imagen del servicio Masaje para Bruxismo, manteniendo tamaño original 141x134 px.
- v13: Se actualizó la imagen del servicio Masaje Linfático, manteniendo tamaño original 109x105 px.
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
