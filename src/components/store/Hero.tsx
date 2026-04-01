import Link from "next/link";
import { ArrowRight, Shield, Truck, Wrench } from "lucide-react";

export default function Hero() {
  return (
    <div className="hero">
      <div className="container">
        <div className="hero__content animate-fadeup">
          <div className="hero__tag">
            🚴 Accesorios Premium
          </div>
          <h1 className="hero__title">
            Equípate para<br />
            el{" "}
            <span className="accent">próximo ride</span>
          </h1>
          <p className="hero__desc">
            Multiherramientas, luces LED, protecciones y más. Todo lo que necesitas
            para disfrutar cada pedalada con confianza.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link href="/#catalog" className="btn btn-primary btn-lg">
              Ver productos <ArrowRight size={18} />
            </Link>
            <Link href="/?cat=herramientas" className="btn btn-secondary btn-lg">
              Herramientas
            </Link>
          </div>

          {/* Trust badges */}
          <div style={{
            display: "flex", gap: "1.5rem", marginTop: "2.5rem", flexWrap: "wrap"
          }}>
            {[
              { icon: <Truck size={15} />, text: "Envío a todo Chile" },
              { icon: <Shield size={15} />, text: "Garantía de calidad" },
              { icon: <Wrench size={15} />, text: "Herramientas Pro" },
            ].map((item) => (
              <div key={item.text} style={{
                display: "flex", alignItems: "center", gap: "0.4rem",
                fontSize: "0.82rem", color: "var(--color-text-muted)"
              }}>
                <span style={{ color: "var(--color-primary)" }}>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative glow orbs */}
      <div style={{
        position: "absolute", right: "10%", top: "20%",
        width: 300, height: 300,
        background: "radial-gradient(circle, rgba(196,82,0,0.08) 0%, transparent 70%)",
        borderRadius: "50%", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", right: "5%", bottom: "10%",
        width: 200, height: 200,
        background: "radial-gradient(circle, rgba(196,82,0,0.05) 0%, transparent 70%)",
        borderRadius: "50%", pointerEvents: "none",
      }} />
    </div>
  );
}
