import Link from "next/link";
import { LayoutDashboard, PackageSearch, Boxes, ShoppingBag, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
          <Link href="/" className="admin-nav__link admin-nav__link--logout">
            <LogOut size={20} />
            <span>Volver a la tienda</span>
          </Link>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
