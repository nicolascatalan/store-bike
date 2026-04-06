"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Check, ChevronRight, ShoppingCart, Truck, Shield, Star, User } from "lucide-react";
import { getProducts, getReviews } from "@/lib/actions";
import type { DBProduct, DBReview } from "@/lib/supabase";
import { useCart } from "@/lib/cart";
import ProductCard from "@/components/store/ProductCard";

function formatCLP(price: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(price);
}

// Sub-componente de Reviews
function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<DBReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReviews(productId).then((res) => {
      setReviews(res);
      setLoading(false);
    });
  }, [productId]);

  const avgRating = reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : "0";

  return (
    <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid var(--color-border)" }}>
      <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Reseñas del Producto</h3>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem", alignItems: "start" }}>
        
        {/* Sumario y Formulario */}
        <div className="admin-card">
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <h4 style={{ fontSize: "3rem", margin: 0, color: "var(--color-primary)" }}>{avgRating}</h4>
            <div style={{ display: "flex", justifyContent: "center", gap: "0.2rem", color: "#fbbf24", marginBottom: "0.5rem" }}>
              {[1,2,3,4,5].map(i => <Star key={i} size={20} fill={i <= parseFloat(avgRating) ? "currentColor" : "none"} />)}
            </div>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>basado en {reviews.length} reseñas verificadas</p>
          </div>
          
          <div style={{ textAlign: "center", padding: "1rem", background: "var(--color-surface)", border: "1px dashed var(--color-border)", borderRadius: "8px" }}>
            <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)" }}>
              Solo los clientes que han comprado este producto reciben un link por correo para dejar su reseña.
            </p>
          </div>
        </div>

        {/* Lista de Reseñas */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {loading ? (
            <p>Cargando reseñas...</p>
          ) : reviews.length === 0 ? (
            <div style={{ background: "var(--color-surface-2)", padding: "2rem", borderRadius: "12px", textAlign: "center" }}>
              <Star size={48} style={{ color: "var(--color-border)", margin: "0 auto", marginBottom: "1rem" }} />
              <p>No hay reseñas todavía.</p>
              <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)" }}>¡Sé el primer cliente verificado en opinar!</p>
            </div>
          ) : (
            reviews.map(review => (
              <div key={review.id} style={{ background: "var(--color-surface-2)", borderRadius: "12px", padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 600 }}>
                    <div style={{ background: "var(--color-primary)", color: "white", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" }}>
                      <User size={14} />
                    </div>
                    {review.author_name}
                  </div>
                  <div style={{ display: "flex", gap: "0.1rem", color: "#fbbf24" }}>
                    {[1,2,3,4,5].map(i => <Star key={i} size={14} fill={i <= review.rating ? "currentColor" : "none"} />)}
                  </div>
                </div>
                <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem", lineHeight: 1.5 }}>
                  "{review.comment}"
                </p>
                <p style={{ fontSize: "0.75rem", color: "var(--color-text-subtle)", marginTop: "0.5rem", textAlign: "right" }}>
                  {new Date(review.created_at).toLocaleDateString("es-CL")}
                </p>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default function ProductClient({ product }: { product: DBProduct }) {
  const [related, setRelated] = useState<DBProduct[]>([]);
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    getProducts().then((all) => {
      const rel = all.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
      setRelated(rel);
    });
  }, [product]);

  function handleAddToCart() {
    if (product.stock === 0) return;
    for (let i = 0; i < qty; i++) {
      addItem({
        id: product.id,
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        price: product.price,
        image: product.image || "/images/placeholder-tool.jpg",
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
    repuestos: "Repuestos",
    accesorios: "Accesorios"
  };

  return (
    <div>
      <section className="section" style={{ paddingBottom: "2rem" }}>
        <div className="container">
          {/* Breadcrumb */}
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Inicio</Link>
            <ChevronRight size={14} />
            <Link href={`/?cat=${product.category}`}>{categoryLabel[product.category] || product.category}</Link>
            <ChevronRight size={14} />
            <span>{product.name}</span>
          </nav>

          {/* Product layout */}
          <div className="product-detail__grid">
            {/* Image panel */}
            <div className="product-detail__image-panel">
              <div className="product-detail__image">
                <div style={{ position: "relative", width: "100%", height: "100%" }}>
                  <img
                    src={product.image || "/images/placeholder-tool.jpg"}
                    alt={product.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px" }}
                  />
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
              {product.features && Array.isArray(product.features) && (
                <ul className="product-detail__features">
                  {(product.features as string[]).map((f) => (
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
              {product.specs && typeof product.specs === "object" && Object.keys(product.specs).length > 0 && (
                <div className="product-detail__specs">
                  <p style={{ fontWeight: 600, marginBottom: "0.75rem", color: "var(--color-text)" }}>Especificaciones</p>
                  <table className="specs-table">
                    <tbody>
                      {Object.entries(product.specs as Record<string, string>).map(([key, val]) => (
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
                <ProductCard key={p.id} product={p as any} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews */}
      <section className="section" style={{ paddingTop: "1rem" }}>
        <div className="container">
          <ProductReviews productId={product.id} />
        </div>
      </section>

      {/* Back link */}
      <div className="container" style={{ paddingBottom: "3rem" }}>
        <Link href="/" className="btn btn-ghost">
          <ArrowLeft size={16} /> Volver al catálogo
        </Link>
      </div>
    </div>
  );
}
