"use client";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";
import type { Product } from "@/lib/products";
import type { DBProduct } from "@/lib/supabase";
import { SlidersHorizontal } from "lucide-react";

const CATEGORIES = [
  { value: "all", label: "Todos" },
  { value: "herramientas", label: "Herramientas" },
  { value: "luces", label: "Luces" },
  { value: "protecciones", label: "Protecciones" },
  { value: "ropa", label: "Ropa" },
  { value: "repuestos", label: "Repuestos" },
  { value: "accesorios", label: "Accesorios" }
];

export default function ProductCatalog({ products }: { products: (Product | DBProduct)[] }) {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("news"); // news, price-asc, price-desc, az

  // Sync with URL query ?cat=
  useEffect(() => {
    const cat = searchParams.get("cat");
    setActiveCategory(cat && CATEGORIES.some((c) => c.value === cat) ? cat : "all");
  }, [searchParams]);

  // Use Memo for performance when sorting & filtering
  const filteredAndSorted = useMemo(() => {
    let result = activeCategory === "all"
      ? [...products]
      : products.filter((p) => p.category === activeCategory);

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "az":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // "news" o por defecto (asumimos que ya vienen ordenados del fetch)
        break;
    }
    
    return result;
  }, [products, activeCategory, sortBy]);

  return (
    <div id="catalog">
      {/* Section header */}
      <div style={{ marginBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ marginBottom: "0.25rem" }}>Nuestros productos</h2>
          <p>
            {filteredAndSorted.length} producto{filteredAndSorted.length !== 1 ? "s" : ""} disponibles
          </p>
        </div>

        {/* Dropdown de Orden */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <SlidersHorizontal size={16} style={{ color: "var(--color-text-muted)" }} />
          <select 
            className="input" 
            style={{ width: "auto", padding: "0.4rem 2rem 0.4rem 0.75rem", fontSize: "0.9rem" }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="news">Lo más nuevo</option>
            <option value="price-asc">Menor a Mayor Precio</option>
            <option value="price-desc">Mayor a Menor Precio</option>
            <option value="az">Alfabético (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Filters (Categorías) */}
      <div className="filters-bar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            id={`filter-${cat.value}`}
            className={`filter-chip${activeCategory === cat.value ? " active" : ""}`}
            onClick={() => setActiveCategory(cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="products-grid">
        {filteredAndSorted.map((product, i) => (
          <ProductCard key={product.id} product={product as any} index={i} />
        ))}
      </div>
    </div>
  );
}
