"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Zap } from "lucide-react";
import { useCart } from "@/lib/cart";

export default function Navbar() {
  const pathname = usePathname();
  const { totalItems } = useCart();

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
          <Link href="/?cat=herramientas" className="">Herramientas</Link>
          <Link href="/?cat=luces" className="">Luces</Link>
          <Link href="/?cat=protecciones" className="">Protecciones</Link>
          <Link href="/?cat=ropa" className="">Ropa</Link>
        </nav>

        {/* Actions */}
        <div className="navbar__actions">
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

