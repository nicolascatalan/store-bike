"use client";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart";
import type { Metadata } from "next";

function formatCLP(price: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function CartPage() {
  const { items, totalItems, totalPrice, removeItem, updateQty, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="section">
        <div className="container">
          <div className="cart-empty">
            <div className="cart-empty__icon">
              <ShoppingCart size={64} strokeWidth={1} />
            </div>
            <h1>Tu carrito está vacío</h1>
            <p>Agrega productos desde el catálogo para continuar.</p>
            <Link href="/" className="btn btn-primary btn-lg" id="go-to-catalog">
              Ver catálogo <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const shipping = totalPrice >= 50000 ? 0 : 4990;
  const total = totalPrice + shipping;

  return (
    <div className="section">
      <div className="container">
        <div style={{ marginBottom: "2rem" }}>
          <h1>Carrito de compras</h1>
          <p>{totalItems} producto{totalItems !== 1 ? "s" : ""} en tu carrito</p>
        </div>

        <div className="cart__layout">
          {/* Items */}
          <div className="cart__items">
            {items.map((item) => (
              <div key={item.id} className="cart__item" id={`cart-item-${item.id}`}>
                {/* Product image */}
                <div className="cart__item-image">
                  <div style={{ position: "relative", width: "100%", height: "100%" }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="cart__item-info">
                  <Link href={`/products/${item.slug}`} className="cart__item-name">
                    {item.name}
                  </Link>
                  <span className="cart__item-brand">{item.brand}</span>
                  <span className="cart__item-price">{formatCLP(item.price)}</span>
                </div>

                {/* Qty controls */}
                <div className="cart__item-controls">
                  <div className="qty-selector">
                    <button
                      className="qty-btn"
                      id={`qty-decrease-${item.id}`}
                      onClick={() => updateQty(item.id, item.quantity - 1)}
                      aria-label="Disminuir cantidad"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      id={`qty-increase-${item.id}`}
                      onClick={() => updateQty(item.id, item.quantity + 1)}
                      aria-label="Aumentar cantidad"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <span className="cart__item-subtotal">{formatCLP(item.price * item.quantity)}</span>
                  <button
                    className="cart__item-remove"
                    id={`remove-${item.id}`}
                    onClick={() => removeItem(item.id)}
                    aria-label={`Eliminar ${item.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {/* Clear cart */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
              <Link href="/" className="btn btn-ghost btn-sm">
                <ArrowLeft size={14} /> Seguir comprando
              </Link>
              <button className="btn btn-ghost btn-sm" id="clear-cart" onClick={clearCart}>
                <Trash2 size={14} /> Vaciar carrito
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="cart__summary">
            <h2 style={{ marginBottom: "1.5rem", fontSize: "1.1rem" }}>Resumen del pedido</h2>

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
            {shipping > 0 && (
              <p style={{ fontSize: "0.8rem", color: "var(--color-text-subtle)", marginTop: "-0.25rem" }}>
                Envío gratis sobre {formatCLP(50000)}
              </p>
            )}

            <div className="divider" />

            <div className="cart__summary-row cart__summary-total">
              <span>Total</span>
              <span>{formatCLP(total)}</span>
            </div>

            <Link
              href="/checkout"
              id="go-to-checkout"
              className="btn btn-primary btn-lg btn-full"
              style={{ marginTop: "1.5rem" }}
            >
              Ir al pago <ArrowRight size={18} />
            </Link>

            <p style={{ fontSize: "0.78rem", color: "var(--color-text-subtle)", textAlign: "center", marginTop: "1rem" }}>
              Pago seguro · Transferencia o tarjeta
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
