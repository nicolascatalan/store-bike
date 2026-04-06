"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";
import type { Product } from "@/lib/products";
import type { DBProduct } from "@/lib/supabase";

const CATEGORIES = [
  { value: "all", label: "Todos" },
  { value: "herramientas", label: "Herramientas" },
  { value: "luces", label: "Luces" },
  { value: "protecciones", label: "Protecciones" },
  { value: "ropa", label: "Ropa" },
];

export default function ProductCatalog({ products }: { products: (Product | DBProduct)[] }) {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("all");

  // Sync with URL query ?cat=
  useEffect(() => {
    const cat = searchParams.get("cat");
    setActiveCategory(cat && CATEGORIES.some((c) => c.value === cat) ? cat : "all");
  }, [searchParams]);

  const filtered =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <div id="catalog">
      {/* Section header */}
      <div style={{ marginBottom: "0.5rem" }}>
        <h2 style={{ marginBottom: "0.25rem" }}>Nuestros productos</h2>
        <p>
          {filtered.length} producto{filtered.length !== 1 ? "s" : ""} disponibles
        </p>
      </div>

      {/* Filters */}
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
        {filtered.map((product, i) => (
          <ProductCard key={product.id} product={product as any} index={i} />
        ))}
      </div>
    </div>
  );
}
