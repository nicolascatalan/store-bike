"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, CreditCard, Building2, Truck } from "lucide-react";
import { useCart } from "@/lib/cart";

function formatCLP(price: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(price);
}

type PayMethod = "transferencia" | "tarjeta" | "webpay";
type Step = "info" | "payment" | "confirm";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [step, setStep] = useState<Step>("info");
  const [payMethod, setPayMethod] = useState<PayMethod>("transferencia");
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    address: "", city: "", region: "",
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [submitting, setSubmitting] = useState(false);

  const shipping = totalPrice >= 50000 ? 0 : 4990;
  const total = totalPrice + shipping;

  if (items.length === 0 && step !== "confirm") {
    return (
      <div className="section">
        <div className="container">
          <div className="cart-empty">
            <h1>Tu carrito está vacío</h1>
            <p>Agrega productos antes de proceder al pago.</p>
            <Link href="/" className="btn btn-primary btn-lg">Ver catálogo</Link>
          </div>
        </div>
      </div>
    );
  }

  function validate() {
    const err: Partial<typeof form> = {};
    if (!form.name.trim()) err.name = "Nombre requerido";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) err.email = "Email inválido";
    if (!form.phone.trim()) err.phone = "Teléfono requerido";
    if (!form.address.trim()) err.address = "Dirección requerida";
    if (!form.city.trim()) err.city = "Ciudad requerida";
    if (!form.region.trim()) err.region = "Región requerida";
    setErrors(err);
    return Object.keys(err).length === 0;
  }

  function handleNextStep() {
    if (step === "info") {
      if (validate()) setStep("payment");
    } else if (step === "payment") {
      handleOrder();
    }
  }

  async function handleOrder() {
    setSubmitting(true);
    // Simulate processing
    await new Promise((r) => setTimeout(r, 1500));
    clearCart();
    setStep("confirm");
    setSubmitting(false);
  }

  if (step === "confirm") {
    return (
      <div className="section">
        <div className="container">
          <div className="order-success">
            <div className="order-success__icon">
              <Check size={48} />
            </div>
            <h1>¡Pedido recibido!</h1>
            <p>Gracias <strong>{form.name || "por tu compra"}</strong>. Te enviaremos la confirmación a <strong>{form.email || "tu correo"}</strong>.</p>
            <div className="order-success__box">
              <p style={{ fontWeight: 600, color: "var(--color-text)" }}>Número de pedido</p>
              <p style={{ fontFamily: "monospace", fontSize: "1.3rem", color: "var(--color-primary)" }}>
                #{Math.floor(Math.random() * 90000) + 10000}
              </p>
            </div>
            <Link href="/" className="btn btn-primary btn-lg" id="back-home">Volver al inicio</Link>
          </div>
        </div>
      </div>
    );
  }

  function field(key: keyof typeof form, label: string, type = "text", placeholder = "") {
    return (
      <div className="form-group">
        <label className="form-label" htmlFor={`field-${key}`}>{label}</label>
        <input
          id={`field-${key}`}
          type={type}
          className={`input ${errors[key] ? "input-error" : ""}`}
          placeholder={placeholder || label}
          value={form[key]}
          onChange={(e) => {
            setForm((f) => ({ ...f, [key]: e.target.value }));
            if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
          }}
        />
        {errors[key] && <span className="input-error-msg">{errors[key]}</span>}
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
        <div style={{ marginBottom: "2rem" }}>
          <Link href="/cart" className="btn btn-ghost btn-sm" style={{ marginBottom: "1rem" }}>
            <ArrowLeft size={14} /> Volver al carrito
          </Link>
          <h1>Checkout</h1>

          {/* Steps indicator */}
          <div className="checkout-steps">
            {(["info", "payment"] as Step[]).map((s, i) => (
              <div key={s} className={`checkout-step ${step === s || (step === "payment" && i === 0) ? "active" : ""} ${step === "payment" && i === 0 ? "done" : ""}`}>
                <span className="checkout-step__num">{i + 1}</span>
                <span>{s === "info" ? "Datos personales" : "Forma de pago"}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="cart__layout">
          {/* Form */}
          <div>
            {step === "info" && (
              <div className="card" style={{ padding: "1.75rem" }}>
                <h2 style={{ fontSize: "1.1rem", marginBottom: "1.5rem" }}>
                  <Truck size={18} style={{ verticalAlign: "middle", marginRight: "0.5rem", color: "var(--color-primary)" }} />
                  Datos de envío
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div style={{ gridColumn: "span 2" }}>{field("name", "Nombre completo")}</div>
                  {field("email", "Email", "email", "tucorreo@mail.com")}
                  {field("phone", "Teléfono", "tel", "+56 9 XXXX XXXX")}
                  <div style={{ gridColumn: "span 2" }}>{field("address", "Dirección", "text", "Av. Ejemplo 1234, Depto 5B")}</div>
                  {field("city", "Ciudad", "text", "Santiago")}
                  {field("region", "Región", "text", "Metropolitana")}
                </div>
                <button
                  id="next-to-payment"
                  className="btn btn-primary btn-lg"
                  style={{ marginTop: "1.5rem", width: "100%" }}
                  onClick={handleNextStep}
                >
                  Continuar al pago →
                </button>
              </div>
            )}

            {step === "payment" && (
              <div className="card" style={{ padding: "1.75rem" }}>
                <h2 style={{ fontSize: "1.1rem", marginBottom: "1.5rem" }}>
                  <CreditCard size={18} style={{ verticalAlign: "middle", marginRight: "0.5rem", color: "var(--color-primary)" }} />
                  Forma de pago
                </h2>

                <div className="pay-methods">
                  {([
                    { value: "transferencia", label: "Transferencia bancaria", icon: <Building2 size={20} /> },
                    { value: "tarjeta", label: "Tarjeta de crédito/débito", icon: <CreditCard size={20} /> },
                    { value: "webpay", label: "WebPay Plus", icon: <span style={{ fontWeight: 700, fontSize: "0.8rem" }}>WP</span> },
                  ] as { value: PayMethod; label: string; icon: React.ReactNode }[]).map((m) => (
                    <label
                      key={m.value}
                      id={`pay-method-${m.value}`}
                      className={`pay-method ${payMethod === m.value ? "active" : ""}`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={m.value}
                        checked={payMethod === m.value}
                        onChange={() => setPayMethod(m.value)}
                        style={{ display: "none" }}
                      />
                      <span style={{ color: "var(--color-primary)" }}>{m.icon}</span>
                      <span>{m.label}</span>
                      {payMethod === m.value && <Check size={16} style={{ marginLeft: "auto", color: "var(--color-primary)" }} />}
                    </label>
                  ))}
                </div>

                {payMethod === "transferencia" && (
                  <div className="pay-info-box" style={{ marginTop: "1.25rem" }}>
                    <p style={{ fontWeight: 600, color: "var(--color-text)", marginBottom: "0.5rem" }}>Datos bancarios</p>
                    <p>Banco: <strong>BancoEstado</strong></p>
                    <p>Cuenta corriente: <strong>00123456789</strong></p>
                    <p>RUT: <strong>76.123.456-7</strong></p>
                    <p>Email: <strong>pagos@tiendabici.cl</strong></p>
                    <p style={{ marginTop: "0.5rem", fontSize: "0.82rem", color: "var(--color-text-subtle)" }}>
                      Envía el comprobante al email indicado para confirmar tu pedido.
                    </p>
                  </div>
                )}

                <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
                  <button className="btn btn-secondary" onClick={() => setStep("info")} id="back-to-info">
                    ← Atrás
                  </button>
                  <button
                    id="confirm-order"
                    className={`btn btn-primary btn-lg ${submitting ? "btn-loading" : ""}`}
                    style={{ flex: 1 }}
                    onClick={handleNextStep}
                    disabled={submitting}
                  >
                    {submitting ? "Procesando…" : "Confirmar pedido ✓"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order summary sidebar */}
          <div className="cart__summary">
            <h2 style={{ marginBottom: "1.5rem", fontSize: "1.1rem" }}>Tu pedido</h2>
            {items.map((item) => (
              <div key={item.id} className="cart__summary-row" style={{ fontSize: "0.88rem" }}>
                <span style={{ color: "var(--color-text-muted)" }}>
                  {item.name} × {item.quantity}
                </span>
                <span>{formatCLP(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="divider" />
            <div className="cart__summary-row">
              <span>Subtotal</span>
              <span>{formatCLP(totalPrice)}</span>
            </div>
            <div className="cart__summary-row">
              <span>Envío</span>
              <span style={{ color: shipping === 0 ? "var(--color-success)" : "inherit" }}>
                {shipping === 0 ? "Gratis 🎉" : formatCLP(shipping)}
              </span>
            </div>
            <div className="divider" />
            <div className="cart__summary-row cart__summary-total">
              <span>Total</span>
              <span>{formatCLP(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
