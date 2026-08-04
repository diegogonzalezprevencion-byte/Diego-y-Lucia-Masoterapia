"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [interes, setInteres] = useState("masoterapia");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, nombre, interes })
      });

      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "No se pudo registrar.");

      setMessage("Suscripción registrada correctamente.");
      setEmail("");
      setNombre("");
    } catch (err: any) {
      setError(err.message || "No se pudo registrar.");
    }
  }

  return (
    <form className="form" onSubmit={submit}>
      <input className="input" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
      <input className="input" type="email" required placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} />
      <select className="select" value={interes} onChange={(e) => setInteres(e.target.value)}>
        <option value="masoterapia">Masoterapia</option>
        <option value="bienestar">Bienestar</option>
        <option value="relajacion">Relajación</option>
        <option value="general">General</option>
      </select>
      <button className="btn" type="submit">Suscribirme</button>
      {message && <div className="notice">{message}</div>}
      {error && <div className="error">{error}</div>}
    </form>
  );
}
