"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, ChevronRight, ShoppingCart, Truck, Shield } from "lucide-react";
import { getProductBySlug, getProducts } from "@/lib/actions";
import type { DBProduct } from "@/lib/supabase";
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
function ProductDetail({ product }: { product: DBProduct }) {
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

      {/* Back link */}
      <div className="container" style={{ paddingBottom: "3rem" }}>
        <Link href="/" className="btn btn-ghost">
          <ArrowLeft size={16} /> Volver al catálogo
        </Link>
      </div>
    </div>
  );
}

// Para usar async state hydration gracefully (ya que usamos use client generalizamos esto envolviendo en page.tsx asincrónico por separado no es ideal con SSR local. Para la MVP usaremos useEffect en una capa superior o resolveremos via promise).
export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const [product, setProduct] = useState<DBProduct | null | undefined>(undefined);
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  useEffect(() => {
    if (slug) {
      getProductBySlug(slug).then((res) => {
        if (!res) return setProduct(null);
        setProduct(res);
      });
    }
  }, [slug]);

  if (product === undefined) return <div className="container" style={{ padding: "4rem" }}>Cargando...</div>;
  if (product === null) notFound();

  return <ProductDetail product={product} />;
}
