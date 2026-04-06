"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useWishlist } from "@/lib/wishlist";
import { getProducts } from "@/lib/actions";
import type { DBProduct } from "@/lib/supabase";
import ProductCard from "@/components/store/ProductCard";
import { Heart, ArrowLeft } from "lucide-react";

export default function WishlistPage() {
  const { items: wishlistIds } = useWishlist();
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const all = await getProducts();
      setProducts(all.filter((p) => wishlistIds.includes(p.id)));
      setLoading(false);
    }
    load();
  }, [wishlistIds]);

  return (
    <div className="section" style={{ minHeight: "60vh" }}>
      <div className="container">
        
        <div style={{ marginBottom: "2rem", display: "flex", gap: "1rem", alignItems: "center" }}>
          <div>
            <h1 style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-primary)" }}>
              <Heart fill="currentColor" /> Mis Favoritos
            </h1>
            <p style={{ color: "var(--color-text-muted)" }}>
              {wishlistIds.length} artículo{wishlistIds.length !== 1 ? "s" : ""} en tu lista
            </p>
          </div>
        </div>

        {loading ? (
          <p>Cargando tus favoritos...</p>
        ) : products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem", background: "var(--color-surface)", borderRadius: "12px", border: "1px dashed var(--color-border)" }}>
            <Heart size={48} style={{ color: "var(--color-border)", margin: "0 auto", marginBottom: "1rem" }} />
            <h2 style={{ marginBottom: "0.5rem" }}>Aún no tienes favoritos</h2>
            <p style={{ color: "var(--color-text-muted)", marginBottom: "2rem" }}>
              Explora nuestro catálogo y presiona el corazón en los productos que más te gusten.
            </p>
            <Link href="/" className="btn btn-primary">
              <ArrowLeft size={16} /> Volver a la Tienda
            </Link>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p as any} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
