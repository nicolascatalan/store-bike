"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Check, CreditCard, Building2, Truck, ShoppingBag, ExternalLink } from "lucide-react";
import { useCart } from "@/lib/cart";

function formatCLP(price: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(price);
}

type PayMethod = "mercadopago" | "transferencia";
type Step = "info" | "payment" | "confirm";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState<Step>("info");
  const [payMethod, setPayMethod] = useState<PayMethod>("mercadopago");
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    address: "", city: "", region: "",
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [submitting, setSubmitting] = useState(false);
  const [mpError, setMpError] = useState<string | null>(null);

  // Auto-fill for logged-in users
  useEffect(() => {
    async function getUserData() {
      const { createClient } = await import("@/lib/supabase-browser");
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setForm(f => ({
          ...f,
          email: user.email || "",
          name: user.user_metadata?.full_name || "",
        }));
      }
    }
    getUserData();
  }, []);

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
    setMpError(null);

    if (payMethod === "mercadopago") {
      try {
        const res = await fetch("/api/create-preference", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((i) => ({
              id: i.id,
              name: i.name,
              price: i.price,
              quantity: i.quantity,
            })),
            customer: {
              name: form.name,
              email: form.email,
              phone: form.phone,
            },
            shipping,
            total,
          }),
        });

        const data = await res.json();

        if (!res.ok || data.error) {
          setMpError(data.error ?? "No se pudo iniciar el pago. Intenta nuevamente.");
          setSubmitting(false);
          return;
        }

        // Limpiar carrito y redirigir a MercadoPago
        clearCart();
        window.location.href = data.initPoint;
      } catch {
        setMpError("Error de conexión. Verifica tu internet e intenta nuevamente.");
        setSubmitting(false);
      }
      return;
    }

    // Transferencia bancaria: guardar pedido y mostrar éxito
    try {
      await fetch("/api/create-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            id: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
          customer: {
            name: form.name,
            email: form.email,
            phone: form.phone,
          },
          shipping,
          total,
          skipMP: true,
        }),
      });
    } catch { /* ignorar */ }

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
            <p>
              Gracias <strong>{form.name}</strong>. Recibirás la confirmación en{" "}
              <strong>{form.email}</strong>.
            </p>
            <div className="order-success__box">
              <p style={{ fontWeight: 600, color: "var(--color-text)", marginBottom: "0.5rem" }}>
                Datos para la transferencia
              </p>
              <p>Banco: <strong>BancoEstado</strong></p>
              <p>Cuenta corriente: <strong>00123456789</strong></p>
              <p>RUT: <strong>76.123.456-7</strong></p>
              <p>Monto: <strong>{formatCLP(total)}</strong></p>
              <p style={{ marginTop: "0.5rem", fontSize: "0.82rem", color: "var(--color-text-subtle)" }}>
                Envía el comprobante a <strong>pagos@tiendabici.cl</strong> para confirmar.
              </p>
            </div>
            <Link href="/" className="btn btn-primary btn-lg" id="back-home">
              Volver al inicio
            </Link>
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
              <div
                key={s}
                className={`checkout-step ${step === s || (step === "payment" && i === 0) ? "active" : ""} ${step === "payment" && i === 0 ? "done" : ""}`}
              >
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
                  {/* MercadoPago */}
                  <label
                    id="pay-method-mercadopago"
                    className={`pay-method ${payMethod === "mercadopago" ? "active" : ""}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="mercadopago"
                      checked={payMethod === "mercadopago"}
                      onChange={() => setPayMethod("mercadopago")}
                      style={{ display: "none" }}
                    />
                    <span style={{ color: "var(--color-primary)", fontWeight: 700, fontSize: "0.9rem" }}>
                      MP
                    </span>
                    <div>
                      <span style={{ fontWeight: 600 }}>MercadoPago</span>
                      <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginTop: "2px" }}>
                        Tarjeta, débito, cuotas sin interés, efectivo
                      </p>
                    </div>
                    {payMethod === "mercadopago" && <Check size={16} style={{ marginLeft: "auto", color: "var(--color-primary)" }} />}
                  </label>

                  {/* Transferencia */}
                  <label
                    id="pay-method-transferencia"
                    className={`pay-method ${payMethod === "transferencia" ? "active" : ""}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="transferencia"
                      checked={payMethod === "transferencia"}
                      onChange={() => setPayMethod("transferencia")}
                      style={{ display: "none" }}
                    />
                    <span style={{ color: "var(--color-primary)" }}>
                      <Building2 size={20} />
                    </span>
                    <div>
                      <span style={{ fontWeight: 600 }}>Transferencia bancaria</span>
                      <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginTop: "2px" }}>
                        Confirma tu pedido enviando el comprobante
                      </p>
                    </div>
                    {payMethod === "transferencia" && <Check size={16} style={{ marginLeft: "auto", color: "var(--color-primary)" }} />}
                  </label>
                </div>

                {/* Info según método */}
                {payMethod === "mercadopago" && (
                  <div className="pay-info-box" style={{ marginTop: "1.25rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
                      <ShoppingBag size={16} style={{ color: "var(--color-primary)" }} />
                      <p style={{ fontWeight: 600, color: "var(--color-text)" }}>Pago seguro con MercadoPago</p>
                    </div>
                    <p style={{ fontSize: "0.82rem", color: "var(--color-text-subtle)" }}>
                      Serás redirigido al sitio de MercadoPago para completar el pago.
                      Acepta tarjetas Visa, Mastercard, débito Redcompra y cuotas sin interés.
                    </p>
                  </div>
                )}

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

                {mpError && (
                  <div style={{
                    marginTop: "1rem",
                    padding: "0.85rem 1rem",
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.25)",
                    borderRadius: "var(--radius-md)",
                    color: "var(--color-danger)",
                    fontSize: "0.88rem",
                  }}>
                    {mpError}
                  </div>
                )}

                <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
                  <button className="btn btn-secondary" onClick={() => setStep("info")} id="back-to-info">
                    ← Atrás
                  </button>
                  <button
                    id="confirm-order"
                    className={`btn btn-primary btn-lg ${submitting ? "btn-loading" : ""}`}
                    style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
                    onClick={handleNextStep}
                    disabled={submitting}
                  >
                    {submitting
                      ? "Procesando…"
                      : payMethod === "mercadopago"
                      ? (<><ExternalLink size={18} /> Pagar con MercadoPago</>)
                      : "Confirmar pedido ✓"
                    }
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

            <div style={{ marginTop: "1.25rem", padding: "0.75rem", background: "var(--color-surface-2)", borderRadius: "var(--radius-md)", fontSize: "0.78rem", color: "var(--color-text-muted)", textAlign: "center" }}>
              🔒 Pago 100% seguro · Encriptado SSL
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
