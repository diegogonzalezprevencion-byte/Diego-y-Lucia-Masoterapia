import nodemailer from "nodemailer";

type ReservaEmailData = {
  id?: string;
  area?: string;
  servicio?: string;
  fecha?: string;
  hora?: string;
  sucursal?: string;
  masoterapeuta?: string;
  nombre?: string;
  email?: string;
  telefono?: string;
  comentarios?: string | null;
  estado?: string;
};

type EmailResult = {
  sent: boolean;
  skipped?: boolean;
  reason?: string;
  error?: string;
};

const DEFAULT_CONTACT_EMAIL = "contacto@umbralcorporal.cl";

function getEmailSettings() {
  const user = process.env.EMAIL_USER || DEFAULT_CONTACT_EMAIL;
  const pass = process.env.EMAIL_PASS;
  const to = process.env.EMAIL_TO || DEFAULT_CONTACT_EMAIL;
  const from = process.env.EMAIL_FROM || `"Umbral Corporal" <${DEFAULT_CONTACT_EMAIL}>`;
  const host = process.env.EMAIL_HOST || "smtp.gmail.com";
  const port = Number(process.env.EMAIL_PORT || 465);
  const secure = String(process.env.EMAIL_SECURE || "true").toLowerCase() !== "false";

  if (!pass) {
    return {
      configured: false as const,
      reason: "Falta configurar EMAIL_PASS en Vercel. Debe ser la clave SMTP o contraseña de aplicación del correo contacto@umbralcorporal.cl.",
      user,
      to,
      from,
      host,
      port,
      secure
    };
  }

  return {
    configured: true as const,
    user,
    pass,
    to,
    from,
    host,
    port,
    secure
  };
}

function createTransporter() {
  const settings = getEmailSettings();
  if (!settings.configured) return { settings, transporter: null };

  const transporter = nodemailer.createTransport({
    host: settings.host,
    port: settings.port,
    secure: settings.secure,
    auth: {
      user: settings.user,
      pass: settings.pass
    }
  });

  return { settings, transporter };
}

function clean(value?: string | null) {
  return value?.toString().trim() || "No informado";
}

function formatDateForClient(value?: string | null) {
  if (!value) return "No informada";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${day}-${month}-${year}`;
}

function getServiceName(servicio?: string | null) {
  const value = clean(servicio);
  return value.split("|")[0].trim();
}

function getReservationValue(servicio?: string | null) {
  const value = clean(servicio);

  const offerMatch = value.match(/Oferta[^:]*:\s*(\$[\d.]+)/i);
  if (offerMatch?.[1]) return offerMatch[1];

  const priceMatch = value.match(/\$\s*[\d.]+/);
  if (priceMatch?.[0]) return priceMatch[0].replace(/\$\s*/, "$");

  return "Consultar";
}

function getOriginalReservationValue(servicio?: string | null) {
  const value = clean(servicio);
  const originalMatch = value.match(/\(antes\s*(\$[\d.]+)\)/i);
  return originalMatch?.[1] || "";
}

function reservationAdminText(reserva: ReservaEmailData) {
  return [
    `Servicio: ${clean(reserva.servicio)}`,
    `Fecha: ${formatDateForClient(reserva.fecha)}`,
    `Hora: ${clean(reserva.hora)}`,
    `Sucursal: ${clean(reserva.sucursal)}`,
    `Masoterapeuta: ${clean(reserva.masoterapeuta)}`,
    `Cliente: ${clean(reserva.nombre)}`,
    `Correo: ${clean(reserva.email)}`,
    `Teléfono / WhatsApp: ${clean(reserva.telefono)}`,
    `Comentarios: ${clean(reserva.comentarios)}`,
    `Estado: ${clean(reserva.estado)}`
  ].join("\n");
}

function reservationClientText(reserva: ReservaEmailData) {
  const value = getReservationValue(reserva.servicio);
  const originalValue = getOriginalReservationValue(reserva.servicio);

  return [
    `Cliente: ${clean(reserva.nombre)}`,
    `Servicio: ${getServiceName(reserva.servicio)}`,
    `Fecha: ${formatDateForClient(reserva.fecha)}`,
    `Hora: ${clean(reserva.hora)}`,
    `Lugar / Sucursal: ${clean(reserva.sucursal)}`,
    `Masoterapeuta: ${clean(reserva.masoterapeuta)}`,
    `Valor: ${value}${originalValue ? ` (valor normal ${originalValue})` : ""}`
  ].join("\n");
}

function reservationHtml(reserva: ReservaEmailData, intro: string) {
  return `
    <div style="font-family: Arial, sans-serif; color:#143d33; line-height:1.55;">
      <h2 style="margin:0 0 12px;">${intro}</h2>
      <table style="border-collapse:collapse; width:100%; max-width:620px;">
        <tbody>
          <tr><td style="padding:8px;border-bottom:1px solid #e3eee8;"><strong>Servicio</strong></td><td style="padding:8px;border-bottom:1px solid #e3eee8;">${getServiceName(reserva.servicio)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #e3eee8;"><strong>Fecha</strong></td><td style="padding:8px;border-bottom:1px solid #e3eee8;">${formatDateForClient(reserva.fecha)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #e3eee8;"><strong>Hora</strong></td><td style="padding:8px;border-bottom:1px solid #e3eee8;">${clean(reserva.hora)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #e3eee8;"><strong>Lugar / Sucursal</strong></td><td style="padding:8px;border-bottom:1px solid #e3eee8;">${clean(reserva.sucursal)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #e3eee8;"><strong>Masoterapeuta</strong></td><td style="padding:8px;border-bottom:1px solid #e3eee8;">${clean(reserva.masoterapeuta)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #e3eee8;"><strong>Valor</strong></td><td style="padding:8px;border-bottom:1px solid #e3eee8;">${getReservationValue(reserva.servicio)}${getOriginalReservationValue(reserva.servicio) ? ` <span style="color:#64746d;">(valor normal ${getOriginalReservationValue(reserva.servicio)})</span>` : ""}</td></tr>
        </tbody>
      </table>
      <p style="margin-top:18px;">Ante cualquier duda, puedes responder este correo o escribirnos a WhatsApp +56 9 5025 7518.</p>
      <p style="margin-top:10px;">Umbral Corporal · Masoterapia y bienestar</p>
    </div>
  `;
}

function adminReservationHtml(reserva: ReservaEmailData, intro: string) {
  return `
    <div style="font-family: Arial, sans-serif; color:#143d33; line-height:1.55;">
      <h2 style="margin:0 0 12px;">${intro}</h2>
      <table style="border-collapse:collapse; width:100%; max-width:620px;">
        <tbody>
          <tr><td style="padding:8px;border-bottom:1px solid #e3eee8;"><strong>Servicio</strong></td><td style="padding:8px;border-bottom:1px solid #e3eee8;">${clean(reserva.servicio)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #e3eee8;"><strong>Fecha</strong></td><td style="padding:8px;border-bottom:1px solid #e3eee8;">${formatDateForClient(reserva.fecha)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #e3eee8;"><strong>Hora</strong></td><td style="padding:8px;border-bottom:1px solid #e3eee8;">${clean(reserva.hora)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #e3eee8;"><strong>Sucursal</strong></td><td style="padding:8px;border-bottom:1px solid #e3eee8;">${clean(reserva.sucursal)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #e3eee8;"><strong>Masoterapeuta</strong></td><td style="padding:8px;border-bottom:1px solid #e3eee8;">${clean(reserva.masoterapeuta)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #e3eee8;"><strong>Cliente</strong></td><td style="padding:8px;border-bottom:1px solid #e3eee8;">${clean(reserva.nombre)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #e3eee8;"><strong>Correo</strong></td><td style="padding:8px;border-bottom:1px solid #e3eee8;">${clean(reserva.email)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #e3eee8;"><strong>Teléfono / WhatsApp</strong></td><td style="padding:8px;border-bottom:1px solid #e3eee8;">${clean(reserva.telefono)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #e3eee8;"><strong>Comentarios</strong></td><td style="padding:8px;border-bottom:1px solid #e3eee8;">${clean(reserva.comentarios)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #e3eee8;"><strong>Estado</strong></td><td style="padding:8px;border-bottom:1px solid #e3eee8;">${clean(reserva.estado)}</td></tr>
        </tbody>
      </table>
      <p style="margin-top:18px;">Umbral Corporal · Masoterapia y bienestar</p>
    </div>
  `;
}

export async function sendAdminReservationNotification(reserva: ReservaEmailData): Promise<EmailResult> {
  const { settings, transporter } = createTransporter();

  if (!settings.configured || !transporter) {
    return { sent: false, skipped: true, reason: settings.reason };
  }

  try {
    await transporter.sendMail({
      from: settings.from,
      to: settings.to,
      replyTo: reserva.email || undefined,
      subject: `Nueva reserva de masoterapia - ${formatDateForClient(reserva.fecha)} ${clean(reserva.hora)}`,
      text: `Nueva reserva registrada en Umbral Corporal.\n\n${reservationAdminText(reserva)}`,
      html: adminReservationHtml(reserva, "Nueva reserva registrada")
    });

    return { sent: true };
  } catch (error: any) {
    console.error("Error enviando notificación de reserva:", error);
    return { sent: false, error: error?.message || "No se pudo enviar el correo de notificación." };
  }
}

export async function sendReservationConfirmationEmail(reserva: ReservaEmailData): Promise<EmailResult> {
  const { settings, transporter } = createTransporter();

  if (!settings.configured || !transporter) {
    return { sent: false, skipped: true, reason: settings.reason };
  }

  if (!reserva.email) {
    return { sent: false, skipped: true, reason: "La reserva no tiene correo de cliente." };
  }

  try {
    await transporter.sendMail({
      from: settings.from,
      to: reserva.email,
      bcc: settings.to,
      replyTo: settings.to,
      subject: "Confirmación de reserva - Umbral Corporal",
      text:
        `Hola ${clean(reserva.nombre)},\n\n` +
        `Confirmamos tu reserva en Umbral Corporal.\n\n` +
        `${reservationClientText({ ...reserva, estado: "confirmada" })}\n\n` +
        `Ante cualquier duda, puedes responder este correo o escribirnos a WhatsApp +56 9 5025 7518.\n\n` +
        `Te esperamos.\nUmbral Corporal`,
      html: reservationHtml({ ...reserva, estado: "confirmada" }, `Hola ${clean(reserva.nombre)}, confirmamos tu reserva`)
    });

    return { sent: true };
  } catch (error: any) {
    console.error("Error enviando confirmación de reserva:", error);
    return { sent: false, error: error?.message || "No se pudo enviar el correo de confirmación." };
  }
}
