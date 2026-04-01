"use client";
import { DollarSign, ShoppingBag, Package, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { label: "Ventas (Mes)", value: "$1.240.500", icon: <DollarSign size={24} />, color: "var(--color-primary)" },
    { label: "Pedidos", value: "34", icon: <ShoppingBag size={24} />, color: "var(--color-success)" },
    { label: "Stock bajo", value: "2", icon: <Package size={24} />, color: "var(--color-warning)" },
    { label: "Conversión", value: "4.2%", icon: <TrendingUp size={24} />, color: "var(--color-text)" },
  ];

  const recentOrders = [
    { id: "#10234", customer: "Juan Pérez", date: "Hoy, 10:30", status: "Pendiente", total: "$54.990" },
    { id: "#10233", customer: "María González", date: "Ayer, 16:45", status: "Pagado", total: "$129.990" },
    { id: "#10232", customer: "Carlos Rojas", date: "Ayer, 11:15", status: "Enviado", total: "$34.990" },
    { id: "#10231", customer: "Ana Silva", date: "28 Mar, 09:20", status: "Entregado", total: "$19.990" },
  ];

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Dashboard</h1>
        <p>Resumen general de tu tienda.</p>
      </div>

      {/* Stats Grid */}
      <div className="admin-stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="admin-stat-card">
            <div className="admin-stat-icon" style={{ color: stat.color, background: `${stat.color}15` }}>
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
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.date}</td>
                  <td>
                    <span className={`admin-badge admin-badge--${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{order.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Productos más vendidos / stock bajo */}
        <div className="admin-card">
          <h2>Alertas de Inventario</h2>
          <div className="admin-alert-list">
             <div className="admin-alert-item warning">
               <Package size={18} />
               <span><strong>Casco MTB Enduro</strong>: Últimas 3 unidades en stock.</span>
             </div>
             <div className="admin-alert-item danger">
               <Package size={18} />
               <span><strong>Guantes MTB Full Finger</strong>: Sin stock actualmente.</span>
             </div>
             <div className="admin-alert-item warning">
               <Package size={18} />
               <span><strong>Luz Trasera LED Roja</strong>: Solo 2 unidades disponibles.</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
