"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart, Zap, Heart, User, LogOut } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { createClient } from "@/lib/supabase-browser";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function getSession() {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
    }
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsDropdownOpen(false);
    router.refresh(); // Refresh current page (especially useful if on a protected route)
  };

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
          {/* User Account / Login */}
          <div style={{ position: "relative" }}>
            {user ? (
              <>
                <button 
                  className="cart-btn" 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  style={{ background: "none", border: "none" }}
                  aria-label="Menú de usuario"
                >
                  <div style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: "var(--color-primary)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    fontWeight: 700
                  }}>
                    {user.email?.[0].toUpperCase() ?? <User size={14} />}
                  </div>
                </button>
                {isDropdownOpen && (
                  <div className="admin-card" style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    marginTop: "0.5rem",
                    width: "200px",
                    padding: "0.5rem",
                    zIndex: 100,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                    border: "1px solid var(--color-border)"
                  }}>
                    <div style={{ padding: "0.75rem", borderBottom: "1px solid var(--color-border)", marginBottom: "0.5rem" }}>
                      <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "0.2rem" }}>Conectado como:</p>
                      <p style={{ fontSize: "0.85rem", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis" }}>{user.email}</p>
                    </div>
                    <Link href="/account" className="admin-nav__link" style={{ fontSize: "0.85rem", padding: "0.6rem" }} onClick={() => setIsDropdownOpen(false)}>
                      <User size={16} /> Ver mi cuenta
                    </Link>
                    <button className="admin-nav__link" style={{ fontSize: "0.85rem", padding: "0.6rem", width: "100%", background: "none", border: "none", color: "var(--color-danger)" }} onClick={handleLogout}>
                      <LogOut size={16} /> Cerrar sesión
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link href="/login" className="cart-btn" aria-label="Iniciar sesión">
                <User size={18} />
              </Link>
            )}
          </div>

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
