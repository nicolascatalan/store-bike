"use client";

import { useState, useTransition } from "react";
import {
  Search,
  AlertTriangle,
  ArrowUpDown,
  Truck,
  Package,
  Check,
} from "lucide-react";
import type { DBProduct } from "@/lib/supabase";
import { updateStock } from "@/lib/actions";
import { useRouter } from "next/navigation";

export default function AdminInventoryClient({ products }: { products: DBProduct[] }) {
  const [search, setSearch] = useState("");
  const [pendingStocks, setPendingStocks] = useState<Record<string, number>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const outOfStock = products.filter((p) => p.stock === 0).length;

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.includes(search)
  );

  function handleStockChange(id: string, value: string) {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 0) {
      setPendingStocks((prev) => ({ ...prev, [id]: num }));
    }
  }

  function handleSaveStock(productId: string) {
    const newStock = pendingStocks[productId];
    if (newStock === undefined) return;
    setSavingId(productId);
    startTransition(async () => {
      await updateStock(productId, newStock);
      setSavingId(null);
      setPendingStocks((prev) => {
        const next = { ...prev };
        delete next[productId];
        return next;
      });
      router.refresh();
    });
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Inventario</h1>
        <p>Controla el stock de tus productos y gestiona reabastecimientos.</p>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card" style={{ padding: "1rem" }}>
          <div
            className="admin-stat-icon"
            style={{ width: "40px", height: "40px", color: "var(--color-primary)", background: "rgba(196,82,0,0.1)" }}
          >
            <Package size={20} />
          </div>
          <div>
            <p className="admin-stat-label">Total en inventario</p>
            <p className="admin-stat-value" style={{ fontSize: "1.2rem" }}>
              {totalStock} unidades
            </p>
          </div>
        </div>
        <div className="admin-stat-card" style={{ padding: "1rem" }}>
          <div
            className="admin-stat-icon"
            style={{ width: "40px", height: "40px", color: "var(--color-warning)", background: "rgba(234, 179, 8,0.1)" }}
          >
            <AlertTriangle size={20} />
          </div>
          <div>
            <p className="admin-stat-label">Bajo Stock</p>
            <p className="admin-stat-value" style={{ fontSize: "1.2rem" }}>
              {lowStock} ítems
            </p>
          </div>
        </div>
        <div className="admin-stat-card" style={{ padding: "1rem" }}>
          <div
            className="admin-stat-icon"
            style={{ width: "40px", height: "40px", color: "var(--color-danger)", background: "rgba(239, 68, 68, 0.1)" }}
          >
            <AlertTriangle size={20} />
          </div>
          <div>
            <p className="admin-stat-label">Stock Agotado</p>
            <p className="admin-stat-value" style={{ fontSize: "1.2rem" }}>
              {outOfStock} ítems
            </p>
          </div>
        </div>
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
              placeholder="Buscar por nombre..."
              style={{ paddingLeft: "35px" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            className="btn btn-secondary"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <Truck size={18} /> Pedir stock
          </button>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Producto</th>
              <th>Cant. Disponible</th>
              <th>Estado de Stock</th>
              <th style={{ textAlign: "right" }}>Ajuste</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((prod) => {
              const currentValue = pendingStocks[prod.id] ?? prod.stock;
              const isDirty = pendingStocks[prod.id] !== undefined;
              const isSaving = savingId === prod.id;

              return (
                <tr key={prod.id}>
                  <td
                    style={{
                      color: "var(--color-text-muted)",
                      fontSize: "0.85rem",
                      fontFamily: "monospace",
                    }}
                  >
                    {prod.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td style={{ fontWeight: 500 }}>{prod.name}</td>
                  <td style={{ fontSize: "1.1rem", fontWeight: 700 }}>{prod.stock}</td>
                  <td>
                    <span
                      className={`admin-badge ${
                        prod.stock > 5
                          ? "admin-badge--pagado"
                          : prod.stock > 0
                          ? "admin-badge--pendiente"
                          : ""
                      }`}
                      style={{
                        background: prod.stock === 0 ? "rgba(239, 68, 68, 0.15)" : "",
                        color: prod.stock === 0 ? "var(--color-danger)" : "",
                        borderColor: prod.stock === 0 ? "rgba(239, 68, 68, 0.3)" : "",
                      }}
                    >
                      {prod.stock === 0 ? "Agotado" : prod.stock <= 3 ? "Crítico" : "Óptimo"}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        border: "1px solid var(--color-border)",
                        borderRadius: "var(--radius-md)",
                        gap: 0,
                      }}
                    >
                      <input
                        type="number"
                        value={currentValue}
                        min={0}
                        style={{
                          width: "60px",
                          padding: "0.4rem",
                          background: "transparent",
                          color: "var(--color-text)",
                          border: "none",
                          textAlign: "center",
                        }}
                        onChange={(e) => handleStockChange(prod.id, e.target.value)}
                      />
                      {isDirty && (
                        <button
                          style={{
                            background: isSaving
                              ? "var(--color-surface-2)"
                              : "var(--color-primary)",
                            color: "white",
                            border: "none",
                            borderLeft: "1px solid var(--color-border)",
                            padding: "0 0.5rem",
                            cursor: isSaving ? "wait" : "pointer",
                            height: "100%",
                            borderRadius: "0 var(--radius-md) var(--radius-md) 0",
                          }}
                          onClick={() => handleSaveStock(prod.id)}
                          disabled={isPending}
                          title="Guardar stock"
                        >
                          {isSaving ? (
                            <ArrowUpDown size={14} />
                          ) : (
                            <Check size={14} />
                          )}
                        </button>
                      )}
                      {!isDirty && (
                        <button
                          style={{
                            background: "var(--color-surface-2)",
                            color: "var(--color-text)",
                            border: "none",
                            borderLeft: "1px solid var(--color-border)",
                            padding: "0 0.5rem",
                            cursor: "default",
                            borderRadius: "0 var(--radius-md) var(--radius-md) 0",
                          }}
                        >
                          <ArrowUpDown size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
