"use client";

import { useState, useTransition } from "react";
import { Plus, Edit, Trash2, Search, X, Check } from "lucide-react";
import type { DBProduct } from "@/lib/supabase";
import { deleteProduct, updateStock } from "@/lib/actions";
import { useRouter } from "next/navigation";

function formatCLP(price: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function AdminProductsClient({ products }: { products: DBProduct[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("todas");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const categories = ["todas", ...Array.from(new Set(products.map((p) => p.category)))];

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "todas" || p.category === category;
    return matchSearch && matchCat;
  });

  function handleDelete(id: string, name: string) {
    if (!confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return;
    startTransition(async () => {
      await deleteProduct(id);
      router.refresh();
    });
  }

  return (
    <div className="admin-page">
      <div
        className="admin-header"
        style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}
      >
        <div>
          <h1>Productos</h1>
          <p>Gestiona el catálogo de tu tienda. ({products.length} productos)</p>
        </div>
        <button
          className="btn btn-primary"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <Plus size={18} /> Nuevo Producto
        </button>
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
              placeholder="Buscar productos..."
              style={{ paddingLeft: "35px" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="input"
            style={{ width: "auto", textTransform: "capitalize" }}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} style={{ textTransform: "capitalize" }}>
                {cat === "todas" ? "Categoría: Todas" : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {filtered.length === 0 ? (
          <p style={{ color: "var(--color-text-muted)", padding: "2rem", textAlign: "center" }}>
            No se encontraron productos.
          </p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th style={{ textAlign: "right" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "var(--radius-sm)",
                          background: "var(--color-surface-2)",
                          flexShrink: 0,
                        }}
                      />
                      <div>
                        <p style={{ fontWeight: 600, fontSize: "0.95rem" }}>{product.name}</p>
                        <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                          {product.brand}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td style={{ textTransform: "capitalize" }}>{product.category}</td>
                  <td style={{ fontWeight: 500 }}>{formatCLP(product.price)}</td>
                  <td>
                    <span
                      className={`admin-badge ${
                        product.stock > 5
                          ? "admin-badge--pagado"
                          : product.stock > 0
                          ? "admin-badge--pendiente"
                          : "admin-badge--danger"
                      }`}
                      style={{
                        background: product.stock === 0 ? "rgba(239, 68, 68, 0.15)" : "",
                        color: product.stock === 0 ? "var(--color-danger)" : "",
                        borderColor: product.stock === 0 ? "rgba(239, 68, 68, 0.3)" : "",
                      }}
                    >
                      {product.stock} unid.
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      aria-label="Editar"
                      style={{ padding: "0.4rem" }}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      aria-label="Eliminar"
                      style={{ padding: "0.4rem", color: "var(--color-danger)" }}
                      onClick={() => handleDelete(product.id, product.name)}
                      disabled={isPending}
                    >
                      <Trash2 size={16} />
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
