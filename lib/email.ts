import nodemailer from "nodemailer";

type ReservaEmailData = {
  id?: string;
  area?: string;
  servicio?: string;
  fecha?: string;
  hora?: string;
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

function getEmailSettings() {
  const user = process.env.EMAIL_USER || "Umbral.corporal@gmail.com";
  const pass = process.env.EMAIL_PASS;
  const to = process.env.EMAIL_TO || "Umbral.corporal@gmail.com";
  const from = process.env.EMAIL_FROM || `"Umbral Corporal" <${user}>`;
  const host = process.env.EMAIL_HOST || "smtp.gmail.com";
  const port = Number(process.env.EMAIL_PORT || 465);
  const secure = String(process.env.EMAIL_SECURE || "true").toLowerCase() !== "false";

  if (!pass) {
    return {
      configured: false as const,
      reason: "Falta configurar EMAIL_PASS en Vercel. Debe ser una contraseña de aplicación de Gmail.",
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

function reservationText(reserva: ReservaEmailData) {
  return [
    `Servicio: ${clean(reserva.servicio)}`,
    `Fecha: ${clean(reserva.fecha)}`,
    `Hora: ${clean(reserva.hora)}`,
    `Cliente: ${clean(reserva.nombre)}`,
    `Correo: ${clean(reserva.email)}`,
    `Teléfono / WhatsApp: ${clean(reserva.telefono)}`,
    `Comentarios: ${clean(reserva.comentarios)}`,
    `Estado: ${clean(reserva.estado)}`
  ].join("\n");
}

function reservationHtml(reserva: ReservaEmailData, intro: string) {
  return `
    <div style="font-family: Arial, sans-serif; color:#143d33; line-height:1.55;">
      <h2 style="margin:0 0 12px;">${intro}</h2>
      <table style="border-collapse:collapse; width:100%; max-width:620px;">
        <tbody>
          <tr><td style="padding:8px;border-bottom:1px solid #e3eee8;"><strong>Servicio</strong></td><td style="padding:8px;border-bottom:1px solid #e3eee8;">${clean(reserva.servicio)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #e3eee8;"><strong>Fecha</strong></td><td style="padding:8px;border-bottom:1px solid #e3eee8;">${clean(reserva.fecha)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #e3eee8;"><strong>Hora</strong></td><td style="padding:8px;border-bottom:1px solid #e3eee8;">${clean(reserva.hora)}</td></tr>
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
      subject: `Nueva reserva de masoterapia - ${clean(reserva.fecha)} ${clean(reserva.hora)}`,
      text: `Nueva reserva registrada en Umbral Corporal.\n\n${reservationText(reserva)}`,
      html: reservationHtml(reserva, "Nueva reserva registrada")
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
      subject: "Reserva confirmada - Umbral Corporal",
      text:
        `Hola ${clean(reserva.nombre)},\n\n` +
        `Tu reserva fue confirmada por Umbral Corporal.\n\n` +
        `${reservationText({ ...reserva, estado: "confirmada" })}\n\n` +
        `Te esperamos.\nUmbral Corporal`,
      html: reservationHtml({ ...reserva, estado: "confirmada" }, `Hola ${clean(reserva.nombre)}, tu reserva fue confirmada`)
    });

    return { sent: true };
  } catch (error: any) {
    console.error("Error enviando confirmación de reserva:", error);
    return { sent: false, error: error?.message || "No se pudo enviar el correo de confirmación." };
  }
}
