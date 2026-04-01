"use client";
import Link from "next/link";
import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/products";

function formatCLP(price: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(price);
}

function StockLabel({ stock }: { stock: number }) {
  if (stock === 0) return <span className="product-card__stock out">● Sin stock</span>;
  if (stock <= 3) return <span className="product-card__stock low">● Últimas {stock} unidades</span>;
  return <span className="product-card__stock">● En stock ({stock})</span>;
}

export default function ProductCard({ product, index }: { product: Product; index: number }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0) return;
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <Link
      href={`/products/${product.slug}`}
      className="product-card"
      id={`product-card-${product.id}`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Image */}
      <div className="product-card__image">
        <div
          style={{
            width: "100%",
            height: "100%",
            background: `linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 50%, #1a1a1a 100%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="24" stroke="#c45200" strokeWidth="2" opacity="0.4" />
            <circle cx="32" cy="32" r="8" fill="#c45200" opacity="0.3" />
            <path d="M32 14V18M32 46V50M14 32H18M46 32H50" stroke="#c45200" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
          </svg>
        </div>
        {product.stock === 0 && (
          <div className="product-card__badge" style={{ background: "#555" }}>Agotado</div>
        )}
        {product.stock > 0 && product.stock <= 3 && (
          <div className="product-card__badge">¡Últimas!</div>
        )}
      </div>

      {/* Body */}
      <div className="product-card__body">
        <span className="product-card__brand">{product.brand}</span>
        <h3 className="product-card__name">{product.name}</h3>
        <StockLabel stock={product.stock} />
        <div className="product-card__price">{formatCLP(product.price)}</div>

        {/* Add to cart */}
        <button
          id={`add-to-cart-${product.id}`}
          className={`btn btn-sm btn-full ${added ? "btn-success" : product.stock === 0 ? "btn-ghost" : "btn-primary"}`}
          style={{ marginTop: "0.75rem" }}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          aria-label={`Agregar ${product.name} al carrito`}
        >
          {added ? (
            <><Check size={14} /> Agregado</>
          ) : product.stock === 0 ? (
            "Sin stock"
          ) : (
            <><ShoppingCart size={14} /> Agregar</>
          )}
        </button>
      </div>
    </Link>
  );
}
