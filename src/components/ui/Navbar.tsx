"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Zap, Heart } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";

export default function Navbar() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { items: wishlistItems } = useWishlist();

  return (
    <header className="navbar">
      <div className="navbar__inner">
        {/* Logo */}
        <Link href="/" className="navbar__logo">
          <Zap size={22} fill="currentColor" style={{ color: "var(--color-primary)" }} />
          Tienda<span>Bici</span>
        </Link>

        {/* Nav links */}
        <nav className="navbar__nav">
          <Link href="/" className={pathname === "/" ? "active" : ""}>Inicio</Link>
          <Link href="/?cat=herramientas">Herramientas</Link>
          <Link href="/?cat=luces">Luces</Link>
          <Link href="/?cat=protecciones">Protecciones</Link>
          <Link href="/?cat=ropa">Ropa</Link>
          <Link href="/?cat=repuestos">Repuestos</Link>
          <Link href="/?cat=accesorios">Accesorios</Link>
        </nav>

        {/* Actions */}
        <div className="navbar__actions">
          <Link href="/wishlist" className="cart-btn" aria-label="Ver favoritos">
            <Heart size={18} />
            {wishlistItems.length > 0 && (
              <span className="cart-badge" style={{ background: "#ef4444" }}>{wishlistItems.length}</span>
            )}
          </Link>
          <Link href="/cart" className="cart-btn" id="cart-button" aria-label="Ver carrito">
            <ShoppingCart size={18} />
            {totalItems > 0 && (
              <span className="cart-badge" id="cart-count">{totalItems}</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
