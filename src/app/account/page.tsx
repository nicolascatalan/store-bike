"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, ShoppingBag, MapPin, LogOut, ArrowRight, Package } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { DBOrder } from "@/lib/supabase";

export default function AccountPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [orders, setOrders] = useState<DBOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadAccountData() {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
        router.push("/login");
        return;
      }

      setUser(currentUser);

      // Fetch user orders
      const { data: userOrders } = await supabase
        .from("orders")
        .select("*")
        .eq("customer_email", currentUser.email)
        .order("created_at", { ascending: false });

      setOrders(userOrders ?? []);
      setLoading(false);
    }

    loadAccountData();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="section">
        <div className="container">
          <p>Cargando tu cuenta...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
        <div style={{ marginBottom: "3rem" }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Mi Cuenta</h1>
          <p style={{ color: "var(--color-text-muted)" }}>Bienvenido de nuevo, {user?.user_metadata?.full_name || user?.email}</p>
        </div>

        <div className="admin-layout" style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: "2rem", alignItems: "start" }}>
          {/* Sidebar */}
          <aside className="admin-card" style={{ padding: "1rem" }}>
            <div style={{ padding: "1rem", borderBottom: "1px solid var(--color-border)", marginBottom: "1rem", textAlign: "center" }}>
              <div style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "var(--color-primary)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                fontWeight: 700,
                margin: "0 auto 1rem"
              }}>
                {user?.email?.[0].toUpperCase()}
              </div>
              <p style={{ fontWeight: 600, marginBottom: "0.2rem" }}>{user?.user_metadata?.full_name || "Usuario"}</p>
              <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>{user?.email}</p>
            </div>

            <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <button className="admin-nav__link active" style={{ background: "none", border: "none", width: "100%", justifyContent: "flex-start", cursor: "default" }}>
                <ShoppingBag size={18} /> Mis Pedidos
              </button>
              <button className="admin-nav__link" style={{ background: "none", border: "none", width: "100%", justifyContent: "flex-start" }}>
                <MapPin size={18} /> Direcciones
              </button>
              <button className="admin-nav__link" style={{ background: "none", border: "none", width: "100%", justifyContent: "flex-start" }}>
                <User size={18} /> Perfil
              </button>
              <div style={{ height: "1px", background: "var(--color-border)", margin: "0.5rem 0" }} />
              <button onClick={handleLogout} className="admin-nav__link" style={{ background: "none", border: "none", width: "100%", justifyContent: "flex-start", color: "var(--color-danger)" }}>
                <LogOut size={18} /> Cerrar sesión
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="account-content">
            <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>Historial de Pedidos</h2>

            {orders.length === 0 ? (
              <div className="admin-card" style={{ textAlign: "center", padding: "4rem" }}>
                <Package size={48} strokeWidth={1} style={{ color: "var(--color-text-muted)", marginBottom: "1rem" }} />
                <p style={{ fontWeight: 600 }}>Aún no has realizado pedidos</p>
                <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
                  Tus compras aparecerán aquí automáticamente.
                </p>
                <Link href="/" className="btn btn-primary">
                  Ir a la tienda <ArrowRight size={18} />
                </Link>
              </div>
            ) : (
              <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Pedido #</th>
                      <th>Fecha</th>
                      <th>Estado</th>
                      <th>Total</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td><span style={{ fontSize: "0.85rem", fontWeight: 600 }}>#{order.id.slice(0, 8)}</span></td>
                        <td><span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>{new Date(order.created_at).toLocaleDateString("es-CL")}</span></td>
                        <td>
                          <span className={`status-badge ${order.status}`} style={{
                            padding: "0.25rem 0.5rem",
                            borderRadius: "100px",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            background: order.status === "pagado" ? "rgba(34,197,94,0.1)" : "rgba(100,116,139,0.1)",
                            color: order.status === "pagado" ? "var(--color-success)" : "var(--color-text-muted)"
                          }}>
                            {order.status.toUpperCase()}
                          </span>
                        </td>
                        <td><span style={{ fontWeight: 600 }}>${order.total.toLocaleString("es-CL")}</span></td>
                        <td style={{ textAlign: "right" }}>
                          <Link href={`/tracking?order=${order.id}`} className="btn btn-sm btn-ghost">
                            Rastrear
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
