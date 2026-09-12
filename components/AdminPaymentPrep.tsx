"use client";

import { useEffect, useState } from "react";

export default function AdminPaymentPrep() {
  const [items, setItems] = useState<any[]>([]);
  const [provider, setProvider] = useState("");

  async function load() {
    const response = await fetch("/api/admin/pagos");
    const data = await response.json();
    if (data.ok) {
      setItems(data.pagos || []);
      setProvider(data.provider || "pendiente");
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="card">
      <h2>Pagos preparados</h2>
      <p>Proveedor configurado: <strong>{provider}</strong></p>
      <p>Esta sección deja la base lista para Webpay, MercadoPago o Flow.</p>
      <div className="table-wrap">
        <table className="table">
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <strong>${item.monto || 0}</strong><br />
                  Estado: {item.estado}<br />
                  Método: {item.metodo}<br />
                  <small>{item.created_at}</small>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td>No hay pagos registrados.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
