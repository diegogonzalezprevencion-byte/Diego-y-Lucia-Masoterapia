"use client";

import { useEffect, useState } from "react";

export default function AdminSimpleTable({ endpoint, title, field }: { endpoint: string; title: string; field: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(endpoint)
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) setItems(data[field] || []);
        else setError(data.error || "Error al cargar.");
      });
  }, [endpoint, field]);

  return (
    <div className="card">
      <h2>{title}</h2>
      {error && <div className="error">{error}</div>}
      <div className="table-wrap">
        <table className="table">
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <strong>{item.nombre || item.email || item.id}</strong><br />
                  {item.email && <>{item.email}<br /></>}
                  {item.telefono && <>{item.telefono}<br /></>}
                  {item.interes && <span className="status-pill">{item.interes}</span>}
                  {item.estado && <span className="status-pill">{item.estado}</span>}
                  <br />
                  <small>{item.created_at}</small>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td>No hay registros.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
