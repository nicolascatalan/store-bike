"use client";
import Link from "next/link";
import { Zap, Mail } from "lucide-react";

function IgIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FbIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          {/* Brand */}
          <div>
            <Link href="/" className="footer-logo">
              <Zap size={22} fill="currentColor" style={{ color: "var(--color-primary)" }} />
              Tienda<span style={{ color: "var(--color-primary)" }}>Bici</span>
            </Link>
            <p style={{ fontSize: "0.88rem", maxWidth: 280, color: "var(--color-text-muted)", marginTop: "0.75rem" }}>
              Accesorios de ciclismo de alta calidad. Equipate para cada aventura.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }}>
              <a href="#" aria-label="Instagram" className="footer-social"><IgIcon /></a>
              <a href="#" aria-label="Facebook" className="footer-social"><FbIcon /></a>
              <a href="mailto:contacto@tiendabici.cl" aria-label="Email" className="footer-social"><Mail size={20} /></a>
            </div>
          </div>

          {/* Links */}
          <div>
            <p className="footer__heading">Tienda</p>
            <nav className="footer__links">
              <Link href="/">Todos los productos</Link>
              <Link href="/?cat=herramientas">Herramientas</Link>
              <Link href="/?cat=luces">Luces</Link>
              <Link href="/?cat=protecciones">Protecciones</Link>
            </nav>
          </div>

          <div>
            <p className="footer__heading">Ayuda</p>
            <nav className="footer__links">
              <Link href="/">Despacho</Link>
              <Link href="/">Cambios y devoluciones</Link>
              <Link href="/">Contáctanos</Link>
            </nav>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} TiendaBici. Todos los derechos reservados.</span>
          <span>Hecho en Chile 🇨🇱</span>
        </div>
      </div>
    </footer>
  );
}
