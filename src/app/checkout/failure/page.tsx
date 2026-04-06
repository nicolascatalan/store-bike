import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function CheckoutFailurePage() {
  return (
    <div className="section">
      <div className="container">
        <div className="order-success">
          <div
            className="order-success__icon"
            style={{ background: "rgba(239,68,68,0.1)", color: "var(--color-danger)" }}
          >
            <XCircle size={48} />
          </div>

          <h1>Pago no procesado</h1>
          <p>
            Hubo un problema con tu pago. No se realizó ningún cargo.
            <br />
            Puedes intentarlo nuevamente.
          </p>

          <div className="order-success__box" style={{ borderColor: "rgba(239,68,68,0.2)" }}>
            <p style={{ fontSize: "0.88rem", color: "var(--color-text-muted)" }}>
              Posibles causas: fondos insuficientes, datos incorrectos o rechazo del banco emisor.
              Si el problema persiste, contacta a tu banco o prueba con otro medio de pago.
            </p>
          </div>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/checkout" className="btn btn-primary btn-lg" id="retry-checkout">
              <RefreshCw size={18} /> Intentar nuevamente
            </Link>
            <Link href="/cart" className="btn btn-secondary" id="back-to-cart">
              <ArrowLeft size={18} /> Volver al carrito
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
