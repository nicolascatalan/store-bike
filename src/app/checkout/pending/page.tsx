import { Clock, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CheckoutPendingPage() {
  return (
    <div className="section">
      <div className="container">
        <div className="order-success">
          <div
            className="order-success__icon"
            style={{ background: "rgba(234,179,8,0.1)", color: "var(--color-warning)" }}
          >
            <Clock size={48} />
          </div>

          <h1>Pago en revisión</h1>
          <p>
            Tu pago está siendo procesado. Esto puede tomar hasta 24 horas hábiles.
            <br />
            Te notificaremos por email cuando el pago sea confirmado.
          </p>

          <div className="order-success__box" style={{ borderColor: "rgba(234,179,8,0.2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Mail size={20} style={{ color: "var(--color-warning)" }} />
              <p style={{ fontSize: "0.88rem", color: "var(--color-text-muted)" }}>
                Recibirás un email con el estado de tu pedido. Si pagaste con efectivo,
                busca el comprobante en tu casilla para completar el pago.
              </p>
            </div>
          </div>

          <Link href="/" className="btn btn-primary btn-lg" id="back-home-pending">
            Volver al inicio <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
