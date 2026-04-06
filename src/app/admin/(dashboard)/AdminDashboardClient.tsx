"use client";

import { DollarSign, ShoppingBag, Package, TrendingUp } from "lucide-react";
import type { DBOrder } from "@/lib/supabase";

type Stats = {
  totalStock: number;
  lowStock: number;
  outOfStock: number;
  monthlySales: number;
  totalOrders: number;
};

function formatCLP(value: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("es-CL", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminDashboardClient({
  orders,
  stats,
}: {
  orders: DBOrder[];
  stats: Stats;
}) {
  const statCards = [
    {
      label: "Ventas (Mes)",
      value: formatCLP(stats.monthlySales),
      icon: <DollarSign size={24} />,
      color: "var(--color-primary)",
    },
    {
      label: "Pedidos Totales",
      value: String(stats.totalOrders),
      icon: <ShoppingBag size={24} />,
      color: "var(--color-success)",
    },
    {
      label: "Stock bajo",
      value: String(stats.lowStock + stats.outOfStock),
      icon: <Package size={24} />,
      color: "var(--color-warning)",
    },
    {
      label: "Unidades en stock",
      value: String(stats.totalStock),
      icon: <TrendingUp size={24} />,
      color: "var(--color-text)",
    },
  ];

  const recentOrders = orders.slice(0, 5);

  const lowStockAlerts = []; // populated from orders data — comes via inventory

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Dashboard</h1>
        <p>Resumen general de tu tienda.</p>
      </div>

      {/* Stats Grid */}
      <div className="admin-stats-grid">
        {statCards.map((stat, i) => (
          <div key={i} className="admin-stat-card">
            <div
              className="admin-stat-icon"
              style={{ color: stat.color, background: `${stat.color}15` }}
            >
              {stat.icon}
            </div>
            <div>
              <p className="admin-stat-label">{stat.label}</p>
              <p className="admin-stat-value">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-grid-2">
        {/* Pedidos recientes */}
        <div className="admin-card">
          <h2>Pedidos Recientes</h2>
          {recentOrders.length === 0 ? (
            <p style={{ color: "var(--color-text-muted)", padding: "1rem 0" }}>
              Aún no hay pedidos registrados.
            </p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>
                      #{order.id.slice(0, 8)}
                    </td>
                    <td>{order.customer_name}</td>
                    <td>{formatDate(order.created_at)}</td>
                    <td>
                      <span className={`admin-badge admin-badge--${order.status}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td>{formatCLP(order.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Alertas vacías por ahora — se llenan via Supabase realtime en el futuro */}
        <div className="admin-card">
          <h2>Estado del Sistema</h2>
          <div className="admin-alert-list">
            <div className="admin-alert-item" style={{ color: "var(--color-success)" }}>
              <Package size={18} />
              <span>
                <strong>Supabase:</strong> Conectado correctamente.
              </span>
            </div>
            <div className="admin-alert-item" style={{ color: "var(--color-text-muted)" }}>
              <ShoppingBag size={18} />
              <span>
                <strong>Pedidos:</strong> {stats.totalOrders} registrados en total.
              </span>
            </div>
            <div
              className="admin-alert-item"
              style={{
                color:
                  stats.outOfStock > 0
                    ? "var(--color-danger)"
                    : "var(--color-text-muted)",
              }}
            >
              <Package size={18} />
              <span>
                <strong>Sin stock:</strong> {stats.outOfStock} producto
                {stats.outOfStock !== 1 ? "s" : ""} agotado
                {stats.outOfStock !== 1 ? "s" : ""}.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
