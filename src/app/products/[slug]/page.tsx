"use client";
import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, ChevronRight, ShoppingCart, Truck, Shield } from "lucide-react";
import { getProductBySlug, getRelatedProducts, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart";
import ProductCard from "@/components/store/ProductCard";

function formatCLP(price: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(price);
}

// Inner component — only rendered when product is guaranteed defined
function ProductDetail({ product }: { product: Product }) {
  const related = getRelatedProducts(product);
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);

  function handleAddToCart() {
    if (product.stock === 0) return;
    for (let i = 0; i < qty; i++) {
      addItem({
        id: product.id,
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        price: product.price,
        image: product.image,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const categoryLabel: Record<string, string> = {
    herramientas: "Herramientas",
    luces: "Luces",
    protecciones: "Protecciones",
    ropa: "Ropa",
  };

  return (
    <div>
      <section className="section" style={{ paddingBottom: "2rem" }}>
        <div className="container">
          {/* Breadcrumb */}
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Inicio</Link>
            <ChevronRight size={14} />
            <Link href={`/?cat=${product.category}`}>{categoryLabel[product.category]}</Link>
            <ChevronRight size={14} />
            <span>{product.name}</span>
          </nav>

          {/* Product layout */}
          <div className="product-detail__grid">
            {/* Image panel */}
            <div className="product-detail__image-panel">
              <div className="product-detail__image">
                <div style={{
                  width: "100%", height: "100%",
                  background: "linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 50%, #1a1a1a 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="120" height="120" viewBox="0 0 64 64" fill="none">
                    <circle cx="32" cy="32" r="24" stroke="#c45200" strokeWidth="1.5" opacity="0.5" />
                    <circle cx="32" cy="32" r="8" fill="#c45200" opacity="0.4" />
                    <path d="M32 14V18M32 46V50M14 32H18M46 32H50" stroke="#c45200" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
                  </svg>
                </div>
                {product.stock <= 3 && product.stock > 0 && (
                  <div className="product-card__badge">¡Últimas {product.stock}!</div>
                )}
                {product.stock === 0 && (
                  <div className="product-card__badge" style={{ background: "#555" }}>Agotado</div>
                )}
              </div>
            </div>

            {/* Info panel */}
            <div className="product-detail__info">
              <span className="product-card__brand" style={{ fontSize: "0.8rem" }}>
                {product.brand}
              </span>
              <h1 className="product-detail__name">{product.name}</h1>

              <div style={{ marginTop: "0.5rem", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                <div className="product-detail__price">{formatCLP(product.price)}</div>
                {product.stock === 0 ? (
                  <span className="product-card__stock out">● Sin stock</span>
                ) : product.stock <= 3 ? (
                  <span className="product-card__stock low">● Últimas {product.stock} unidades</span>
                ) : (
                  <span className="product-card__stock">● En stock ({product.stock})</span>
                )}
              </div>

              <p style={{ marginTop: "1.25rem", color: "var(--color-text-muted)", lineHeight: 1.8 }}>
                {product.description}
              </p>

              {/* Features */}
              {product.features && (
                <ul className="product-detail__features">
                  {product.features.map((f) => (
                    <li key={f}>
                      <Check size={14} style={{ color: "var(--color-primary)", flexShrink: 0, marginTop: 2 }} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Qty + Add to cart */}
              <div className="product-detail__actions">
                {product.stock > 0 && (
                  <div className="qty-selector">
                    <button
                      id="qty-decrease"
                      className="qty-btn"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      aria-label="Disminuir cantidad"
                    >−</button>
                    <span id="qty-value" className="qty-value">{qty}</span>
                    <button
                      id="qty-increase"
                      className="qty-btn"
                      onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                      aria-label="Aumentar cantidad"
                    >+</button>
                  </div>
                )}

                <button
                  id="add-to-cart-detail"
                  className={`btn btn-lg ${added ? "btn-success" : product.stock === 0 ? "btn-ghost" : "btn-primary"}`}
                  style={{ flex: 1 }}
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  {added ? (
                    <><Check size={18} /> Agregado al carrito</>
                  ) : product.stock === 0 ? (
                    "Sin stock"
                  ) : (
                    <><ShoppingCart size={18} /> Agregar al carrito</>
                  )}
                </button>
              </div>

              {/* Trust badges */}
              <div className="product-detail__trust">
                <div className="trust-item">
                  <Truck size={16} style={{ color: "var(--color-primary)" }} />
                  <span>Envío a todo Chile</span>
                </div>
                <div className="trust-item">
                  <Shield size={16} style={{ color: "var(--color-primary)" }} />
                  <span>Garantía de calidad</span>
                </div>
              </div>

              {/* Specs */}
              {product.specs && (
                <div className="product-detail__specs">
                  <p style={{ fontWeight: 600, marginBottom: "0.75rem", color: "var(--color-text)" }}>Especificaciones</p>
                  <table className="specs-table">
                    <tbody>
                      {Object.entries(product.specs).map(([key, val]) => (
                        <tr key={key}>
                          <td>{key}</td>
                          <td>{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="section" style={{ paddingTop: "1rem" }}>
          <div className="container">
            <h2 style={{ marginBottom: "1.5rem" }}>Productos relacionados</h2>
            <div className="products-grid">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back link */}
      <div className="container" style={{ paddingBottom: "3rem" }}>
        <Link href="/" className="btn btn-ghost">
          <ArrowLeft size={16} /> Volver al catálogo
        </Link>
      </div>
    </div>
  );
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const product = getProductBySlug(slug);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
