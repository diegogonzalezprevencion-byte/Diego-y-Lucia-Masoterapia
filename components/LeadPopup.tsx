"use client";

import { useEffect, useState } from "react";

export default function LeadPopup() {
  const [visible, setVisible] = useState(false);
  const [sent, setSent] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [interes, setInteres] = useState("masoterapia");

  useEffect(() => {
    const closed = localStorage.getItem("lead_popup_closed");
    if (!closed) {
      const timer = setTimeout(() => setVisible(true), 3500);
      return () => clearTimeout(timer);
    }
  }, []);

  function close() {
    localStorage.setItem("lead_popup_closed", "true");
    setVisible(false);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, telefono, interes, origen: "popup" })
    });
    const data = await response.json();
    if (data.ok) {
      setSent(true);
      setNombre("");
      setEmail("");
      setTelefono("");
    } else {
      alert(data.error || "No se pudo registrar el contacto.");
    }
  }

  if (!visible) return null;

  return (
    <div className="lead-popup">
      <div className="card">
        <button className="small-link" onClick={close} style={{ float: "right" }}>Cerrar</button>
        <h3>¿Necesitas orientación?</h3>
        <p>Déjanos tus datos y te ayudaremos a elegir el masaje más adecuado.</p>
        {sent ? (
          <div className="notice">Datos recibidos correctamente.</div>
        ) : (
          <form className="form" onSubmit={submit}>
            <input className="input" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            <input className="input" type="email" placeholder="Correo" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="input" placeholder="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
            <select className="select" value={interes} onChange={(e) => setInteres(e.target.value)}>
              <option value="masoterapia">Masoterapia</option>
              <option value="relajacion">Relajación</option>
              <option value="descontracturante">Descontracturante</option>
              <option value="bienestar">Bienestar</option>
            </select>
            <button className="btn" type="submit">Enviar datos</button>
          </form>
        )}
      </div>
    </div>
  );
}
