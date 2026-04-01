"use client";
import { Search, Eye, Filter } from "lucide-react";

export default function AdminOrders() {
  const orders = [
    { id: "#10234", customer: "Juan Pérez", email: "juan@example.com", date: "Hoy, 10:30", status: "Pendiente", total: "$54.990", items: 1 },
    { id: "#10233", customer: "María González", email: "maria@example.com", date: "Ayer, 16:45", status: "Pagado", total: "$129.990", items: 2 },
    { id: "#10232", customer: "Carlos Rojas", email: "carlos@example.com", date: "Ayer, 11:15", status: "Enviado", total: "$34.990", items: 1 },
    { id: "#10231", customer: "Ana Silva", email: "ana@example.com", date: "28 Mar, 09:20", status: "Entregado", total: "$19.990", items: 1 },
    { id: "#10230", customer: "Pedro Torres", email: "pedro@example.com", date: "27 Mar, 14:10", status: "Entregado", total: "$149.990", items: 3 },
  ];

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Pedidos</h1>
        <p>Administra las compras de tus clientes.</p>
      </div>

      <div className="admin-card">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <div style={{ position: "relative", width: "300px" }}>
            <Search size={18} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-subtle)" }} />
            <input 
              type="text" 
              className="input" 
              placeholder="Buscar pedido por ID o Cliente..." 
              style={{ paddingLeft: "35px" }}
            />
          </div>
          <button className="btn btn-secondary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Filter size={18} /> Filtrar Estados
          </button>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Ítems</th>
              <th>Total</th>
              <th>Estado</th>
              <th style={{ textAlign: "right" }}>Ver</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td style={{ fontWeight: 700, color: "var(--color-primary)" }}>{order.id}</td>
                <td>
                  <p style={{ fontWeight: 600, fontSize: "0.95rem" }}>{order.customer}</p>
                  <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>{order.email}</p>
                </td>
                <td>{order.date}</td>
                <td>{order.items} unid.</td>
                <td style={{ fontWeight: 500 }}>{order.total}</td>
                <td>
                  <span className={`admin-badge admin-badge--${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <button className="btn btn-ghost btn-sm" aria-label="Ver detalles" style={{ padding: "0.4rem" }}>
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
