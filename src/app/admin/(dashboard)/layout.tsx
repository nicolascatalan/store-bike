import Link from "next/link";
import { LayoutDashboard, PackageSearch, Boxes, ShoppingBag, Store } from "lucide-react";
import { createClient } from "@/lib/supabase-server";
import AdminLogoutButton from "./AdminLogoutButton";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="admin-layout">
      {/* Sidebar de navegación */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__header">
          <h2>TiendaBici <span>Admin</span></h2>
        </div>
        
        <nav className="admin-nav">
          <Link href="/admin" className="admin-nav__link">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/orders" className="admin-nav__link">
            <ShoppingBag size={20} />
            <span>Pedidos</span>
          </Link>
          <Link href="/admin/products" className="admin-nav__link">
            <PackageSearch size={20} />
            <span>Productos</span>
          </Link>
          <Link href="/admin/inventory" className="admin-nav__link">
            <Boxes size={20} />
            <span>Inventario</span>
          </Link>
        </nav>

        <div className="admin-sidebar__footer">
          {/* User info */}
          {user && (
            <div style={{
              padding: "0.75rem 1rem",
              marginBottom: "0.5rem",
              borderRadius: "var(--radius-md)",
              background: "var(--color-surface-2)",
              border: "1px solid var(--color-border)",
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
              }}>
                <div style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "var(--color-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "white",
                }}>
                  {user.email?.[0]?.toUpperCase() ?? "A"}
                </div>
                <div style={{ overflow: "hidden" }}>
                  <p style={{
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    color: "var(--color-text)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>
                    {user.email}
                  </p>
                  <p style={{ fontSize: "0.72rem", color: "var(--color-text-muted)" }}>
                    Administrador
                  </p>
                </div>
              </div>
            </div>
          )}

          <Link href="/" className="admin-nav__link" style={{ marginBottom: "0.5rem" }}>
            <Store size={20} />
            <span>Volver a la tienda</span>
          </Link>

          <AdminLogoutButton />
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
