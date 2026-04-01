"use client";
import { Search, AlertTriangle, ArrowUpDown, Truck, Package } from "lucide-react";
import { PRODUCTS } from "@/lib/products";

export default function AdminInventory() {
  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Inventario</h1>
        <p>Controla el stock de tus productos y gestiona reabastecimientos.</p>
      </div>

      <div className="admin-stats-grid">
         <div className="admin-stat-card" style={{ padding: "1rem" }}>
            <div className="admin-stat-icon" style={{ width: "40px", height: "40px", color: "var(--color-primary)", background: "rgba(196,82,0,0.1)" }}>
              <Package size={20} />
            </div>
            <div>
              <p className="admin-stat-label">Total en inventario</p>
              <p className="admin-stat-value" style={{ fontSize: "1.2rem" }}>48 unidades</p>
            </div>
          </div>
          <div className="admin-stat-card" style={{ padding: "1rem" }}>
            <div className="admin-stat-icon" style={{ width: "40px", height: "40px", color: "var(--color-warning)", background: "rgba(234, 179, 8,0.1)" }}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <p className="admin-stat-label">Bajo Stock</p>
              <p className="admin-stat-value" style={{ fontSize: "1.2rem" }}>2 ítems</p>
            </div>
          </div>
          <div className="admin-stat-card" style={{ padding: "1rem" }}>
             <div className="admin-stat-icon" style={{ width: "40px", height: "40px", color: "var(--color-danger)", background: "rgba(239, 68, 68, 0.1)" }}>
               <AlertTriangle size={20} />
             </div>
             <div>
               <p className="admin-stat-label">Stock Agotado</p>
               <p className="admin-stat-value" style={{ fontSize: "1.2rem" }}>1 ítems</p>
             </div>
          </div>
      </div>

      <div className="admin-card">
         <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <div style={{ position: "relative", width: "300px" }}>
            <Search size={18} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-subtle)" }} />
            <input 
              type="text" 
              className="input" 
              placeholder="Buscar por SKU o Nombre..." 
              style={{ paddingLeft: "35px" }}
            />
          </div>
          <button className="btn btn-secondary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
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
             {PRODUCTS.map((prod) => (
               <tr key={prod.slug}>
                 <td style={{ color: "var(--color-text-muted)", fontSize: "0.85rem", fontFamily: "monospace" }}>
                   TB-{prod.id.padStart(4, '0')}
                 </td>
                 <td style={{ fontWeight: 500 }}>{prod.name}</td>
                 <td style={{ fontSize: "1.1rem", fontWeight: 700 }}>{prod.stock}</td>
                 <td>
                    <span className={`admin-badge ${prod.stock > 5 ? 'admin-badge--pagado' : prod.stock > 0 ? 'admin-badge--pendiente' : ''}`} style={{ 
                         background: prod.stock === 0 ? 'rgba(239, 68, 68, 0.15)' : '',
                         color: prod.stock === 0 ? 'var(--color-danger)' : '',
                         borderColor: prod.stock === 0 ? 'rgba(239, 68, 68, 0.3)' : ''
                      }}>
                         {prod.stock === 0 ? "Agotado" : prod.stock <= 3 ? "Crítico" : "Óptimo"}
                      </span>
                 </td>
                 <td style={{ textAlign: "right" }}>
                   <div style={{ display: "inline-flex", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
                      <input type="number" defaultValue={prod.stock} style={{ width: "60px", padding: "0.4rem", background: "transparent", color: "var(--color-text)", border: "none", textAlign: "center" }} />
                      <button style={{ background: "var(--color-surface-2)", color: "var(--color-text)", border: "none", borderLeft: "1px solid var(--color-border)", padding: "0 0.5rem", cursor: "pointer" }}>
                        <ArrowUpDown size={14} />
                      </button>
                   </div>
                 </td>
               </tr>
             ))}
           </tbody>
        </table>
      </div>
    </div>
  );
}
