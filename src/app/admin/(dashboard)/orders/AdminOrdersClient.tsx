"use client";

import { useState, useTransition } from "react";
import { Search, Eye, Filter } from "lucide-react";
import type { DBOrder } from "@/lib/supabase";
import { updateOrderStatus, markAsShipped } from "@/lib/actions";
import { useRouter } from "next/navigation";

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

const STATUS_OPTIONS: string[] = [
  "pendiente",
  "pagado",
  "despachado",
  "enviado",
  "entregado",
  "cancelado",
];

export default function AdminOrdersClient({ orders }: { orders: DBOrder[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_email.toLowerCase().includes(search.toLowerCase()) ||
      o.id.includes(search);
    const matchStatus = statusFilter === "todos" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  function handleStatusChange(orderId: string, newStatus: string) {
    if (newStatus === "despachado") {
      if (!confirm("Al marcar como despachado se enviará un correo automático. ¿Estás seguro?")) return;
    }

    startTransition(async () => {
      if (newStatus === "despachado") {
        await markAsShipped(orderId);
      } else {
        await updateOrderStatus(orderId, newStatus as any);
      }
      router.refresh();
    });
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Pedidos</h1>
        <p>Administra las compras de tus clientes. ({orders.length} en total)</p>
      </div>

      <div className="admin-card">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <div style={{ position: "relative", width: "300px" }}>
            <Search
              size={18}
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--color-text-subtle)",
              }}
            />
            <input
              type="text"
              className="input"
              placeholder="Buscar pedido o cliente..."
              style={{ paddingLeft: "35px" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="input"
            style={{ width: "auto", textTransform: "capitalize" }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="todos">Estado: Todos</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s} style={{ textTransform: "capitalize" }}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {filtered.length === 0 ? (
          <p style={{ color: "var(--color-text-muted)", padding: "2rem", textAlign: "center" }}>
            {orders.length === 0
              ? "Aún no hay pedidos registrados."
              : "No se encontraron pedidos con ese filtro."}
          </p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Ítems</th>
                <th>Total</th>
                <th>Estado</th>
                <th style={{ textAlign: "right" }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id}>
                  <td
                    style={{
                      fontWeight: 700,
                      color: "var(--color-primary)",
                      fontFamily: "monospace",
                      fontSize: "0.85rem",
                    }}
                  >
                    #{order.id.slice(0, 8)}
                  </td>
                  <td>
                    <p style={{ fontWeight: 600, fontSize: "0.95rem" }}>{order.customer_name}</p>
                    <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                      {order.customer_email}
                    </p>
                  </td>
                  <td>{formatDate(order.created_at)}</td>
                  <td>{order.order_items?.length ?? 0} unid.</td>
                  <td style={{ fontWeight: 500 }}>{formatCLP(order.total)}</td>
                  <td>
                    <select
                      className="input"
                      style={{
                        width: "auto",
                        padding: "0.3rem 0.5rem",
                        fontSize: "0.8rem",
                        textTransform: "capitalize",
                      }}
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value as DBOrder["status"])
                      }
                      disabled={isPending}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      aria-label="Ver detalles"
                      style={{ padding: "0.4rem" }}
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
