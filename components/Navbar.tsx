import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link className="brand" href="/">Diego Masoterapia</Link>
        <div className="nav-links">
          <Link href="/">Inicio</Link>
          <Link href="/agenda-masoterapia">Agenda</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/newsletter">Newsletter</Link>
          <Link href="/contacto">Contacto</Link>
          <Link href="/politicas">Políticas</Link>
          <Link href="/admin">Admin</Link>
        </div>
      </div>
    </nav>
  );
}
