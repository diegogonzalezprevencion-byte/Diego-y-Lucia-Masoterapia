"use client";

import { useEffect, useState } from "react";

type Testimonio = {
  id: string;
  nombre: string;
  edad?: number | null;
  servicio_realizado?: string | null;
  comentario: string;
  created_at?: string;
};

export default function PublicTestimonials() {
  const [items, setItems] = useState<Testimonio[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [servicioRealizado, setServicioRealizado] = useState("");
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function loadTestimonials() {
    setLoading(true);
    try {
      const response = await fetch("/api/testimonios", { cache: "no-store" });
      const data = await response.json();
      if (data.ok) setItems(data.testimonios || []);
    } catch {
      setError("No se pudieron cargar los testimonios.");
    } finally {
      setLoading(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/testimonios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          edad: edad ? Number(edad) : null,
          servicio_realizado: servicioRealizado,
          comentario
        })
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "No se pudo enviar el testimonio.");
      }

      setNombre("");
      setEdad("");
      setServicioRealizado("");
      setComentario("");
      setSuccess("Gracias por compartir tu experiencia. Tu testimonio quedará visible cuando sea revisado por el equipo de Umbral Corporal.");
      setShowForm(false);
      await loadTestimonials();
    } catch (err: any) {
      setError(err.message || "No se pudo enviar el testimonio.");
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    loadTestimonials();
  }, []);

  return (
    <div className="public-testimonials-card" id="testimonios">
      <div className="public-testimonials-header">
        <div>
          <span className="testimonial-eyebrow">Experiencias reales</span>
          <h3>Testimonios</h3>
        </div>
        <button className="btn testimonial-trigger" type="button" onClick={() => setShowForm((value) => !value)}>
          {showForm ? "Cerrar" : "Deja tu testimonio"}
        </button>
      </div>

      <p className="testimonial-intro">
        Historias de personas que han vivido una experiencia de bienestar en Umbral Corporal.
      </p>

      {showForm && (
        <form className="testimonial-form" onSubmit={submit}>
          <input className="input" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          <div className="testimonial-form-row">
            <input className="input" type="number" min="0" max="120" placeholder="Edad" value={edad} onChange={(e) => setEdad(e.target.value)} />
            <input className="input" placeholder="Servicio realizado" value={servicioRealizado} onChange={(e) => setServicioRealizado(e.target.value)} required />
          </div>
          <textarea className="textarea" placeholder="Cuéntanos brevemente tu experiencia" value={comentario} onChange={(e) => setComentario(e.target.value)} required />
          <button className="btn" type="submit" disabled={submitting}>
            {submitting ? "Enviando..." : "Enviar testimonio"}
          </button>
          <small>El testimonio será publicado solo después de revisión del administrador.</small>
        </form>
      )}

      {success && <div className="notice testimonial-message"><strong>{success}</strong></div>}
      {error && <div className="error testimonial-message"><strong>{error}</strong></div>}

      <div className="testimonial-list">
        {loading && <p>Cargando testimonios...</p>}

        {!loading && items.length === 0 && (
          <div className="testimonial-empty">
            <strong>Aún no hay testimonios publicados.</strong>
            <span>Pronto compartiremos experiencias revisadas por el equipo.</span>
          </div>
        )}

        {!loading && items.slice(0, 6).map((item) => (
          <article className="testimonial-public-item" key={item.id}>
            <p>“{item.comentario}”</p>
            <div>
              <strong>{item.nombre}{item.edad ? ` · ${item.edad} años` : ""}</strong>
              <span>{item.servicio_realizado || "Servicio de masoterapia"}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
