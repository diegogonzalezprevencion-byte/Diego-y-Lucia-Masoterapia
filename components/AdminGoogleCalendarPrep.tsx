"use client";

import { useEffect, useState } from "react";

export default function AdminGoogleCalendarPrep() {
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/google-calendar")
      .then((r) => r.json())
      .then((data) => setStatus(data));
  }, []);

  return (
    <div className="card">
      <h2>Google Calendar</h2>
      <p>Estado: <strong>{status?.status || "cargando"}</strong></p>
      <p>Calendario: <strong>{status?.calendarId || "primary"}</strong></p>
      <p>{status?.message || "Preparando información..."}</p>
      <div className="notice">
        La creación automática de eventos requiere conectar OAuth real con Google Calendar.
      </div>
    </div>
  );
}
