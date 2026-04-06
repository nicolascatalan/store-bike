import { Check, ArrowRight, Package } from "lucide-react";
import Link from "next/link";

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string; payment_id?: string }>;
}) {
  return (
    <div className="section">
      <div className="container">
        <div className="order-success">
          <div className="order-success__icon" style={{ background: "rgba(34,197,94,0.12)", color: "var(--color-success)" }}>
            <Check size={48} />
          </div>

          <h1>¡Pago confirmado!</h1>
          <p>
            Tu pedido fue procesado correctamente por MercadoPago.
            <br />
            Recibirás un email de confirmación en breve.
          </p>

          <div className="order-success__box">
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <Package size={20} style={{ color: "var(--color-primary)" }} />
              <p style={{ fontWeight: 600, color: "var(--color-text)" }}>Tu pedido está en preparación</p>
            </div>
            <p style={{ fontSize: "0.88rem", color: "var(--color-text-muted)" }}>
              Te notificaremos cuando sea despachado. El plazo de entrega es de 3-5 días hábiles.
            </p>
          </div>

          <Link href="/" className="btn btn-primary btn-lg" id="back-home-success">
            Seguir comprando <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
