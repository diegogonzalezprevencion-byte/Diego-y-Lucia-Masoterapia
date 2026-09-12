"use client";
import { useEffect, useState } from "react";

const adminUsers = [
  { username: "Usuario1", password: "lucialorca" },
  { username: "Usuario2", password: "diegogonzalez" },
  { username: "Usuario2", password: "diegogonzalez." }
];

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAuthorized(localStorage.getItem("umbral_admin_ok") === "true");
    }
  }, []);

  function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validUser = adminUsers.some(
      (user) => user.username === username.trim() && user.password === password
    );

    if (validUser) {
      localStorage.setItem("umbral_admin_ok", "true");
      localStorage.setItem("umbral_admin_user", username.trim());
      setAuthorized(true);
    } else {
      alert("Usuario o clave incorrecta.");
    }
  }

  function logout() {
    localStorage.removeItem("umbral_admin_ok");
    localStorage.removeItem("umbral_admin_user");
    setAuthorized(false);
    setUsername("");
    setPassword("");
  }

  if (!authorized) {
    return (
      <section className="section">
        <div className="container">
          <div className="card" style={{ maxWidth: 560 }}>
            <div className="eyebrow">Panel privado</div>
            <h1>Acceso administrador</h1>
            <p>Ingresa con usuario y clave para acceder al panel de administración.</p>
            <form className="form" onSubmit={login}>
              <label className="label">Usuario<input className="input" autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} required /></label>
              <label className="label">Clave<input className="input" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
              <button className="btn" type="submit">Ingresar</button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <div className="admin-session-bar">
        <div className="container admin-session-inner">
          <span>Panel administrador activo</span>
          <button className="btn gray" type="button" onClick={logout}>Cerrar sesión</button>
        </div>
      </div>
      {children}
    </>
  );
}
