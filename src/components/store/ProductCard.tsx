"use client";
import Link from "next/link";
import { ShoppingCart, Check, Heart } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
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
  const { items: wishlistIds, toggleItem: toggleWishlist } = useWishlist();
  const [added, setAdded] = useState(false);

  const isWished = wishlistIds.includes(product.id);

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

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
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
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <img
            src={product.image || "/images/placeholder-tool.jpg"}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "var(--color-surface)",
            border: "none",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            zIndex: 2,
            transition: "all 0.2s"
          }}
          aria-label={isWished ? "Quitar de favoritos" : "Añadir a favoritos"}
        >
          <Heart size={18} fill={isWished ? "#ef4444" : "none"} color={isWished ? "#ef4444" : "var(--color-text)"} />
        </button>

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
