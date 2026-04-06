"use client";

import { useState } from "react";
import { Search, Package, CheckCircle, Clock, Truck } from "lucide-react";
import { trackOrder } from "@/lib/actions";
import Link from "next/link";
import type { DBOrder } from "@/lib/supabase";

export default function TrackingPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<DBOrder | null | "not_found">(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setOrder(null);
    const result = await trackOrder(orderId.trim(), email.trim());
    setOrder(result || "not_found");
    setLoading(false);
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "pendiente":
        return { text: "Pendiente de Pago", icon: <Clock size={24} />, color: "var(--color-warning)" };
      case "pagado":
        return { text: "Preparando", icon: <Package size={24} />, color: "var(--color-success)" };
      case "despachado":
      case "enviado":
        return { text: "En Camino", icon: <Truck size={24} />, color: "var(--color-primary)" };
      case "entregado":
        return { text: "Entregado", icon: <CheckCircle size={24} />, color: "var(--color-success)" };
      default:
        return { text: "Cancelado", icon: <CheckCircle size={24} />, color: "var(--color-danger)" };
    }
  };

  return (
    <div className="section" style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div className="container" style={{ maxWidth: "500px" }}>
        
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ marginBottom: "0.5rem" }}>Sigue tu pedido 📦</h1>
          <p style={{ color: "var(--color-text-muted)" }}>Ingresa tu número de orden y correo para conocer el estado actual.</p>
        </div>

        <div className="admin-card">
          <form onSubmit={handleTrack} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label className="label">Número de Orden</label>
              <input 
                type="text" 
                className="input" 
                placeholder="Ej. f47ac10b..." 
                required 
                value={orderId} 
                onChange={(e) => setOrderId(e.target.value)} 
              />
            </div>
            <div>
              <label className="label">Correo Electrónico</label>
              <input 
                type="email" 
                className="input" 
                placeholder="El correo que usaste en la compra" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: "0.5rem" }}>
              <Search size={18} /> {loading ? "Buscando..." : "Buscar Pedido"}
            </button>
          </form>
        </div>

        {order === "not_found" && (
          <div style={{ marginTop: "2rem", padding: "1.5rem", background: "rgba(239, 68, 68, 0.1)", color: "var(--color-danger)", borderRadius: "8px", textAlign: "center" }}>
            <p><strong>Pedido no encontrado.</strong></p>
            <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>Verifica que el número y el correo estén escritos correctamente.</p>
          </div>
        )}

        {order && order !== "not_found" && (
          <div style={{ marginTop: "2rem", background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "8px", overflow: "hidden" }}>
            <div style={{ padding: "1.5rem", background: "var(--color-surface-2)", borderBottom: "1px solid var(--color-border)" }}>
              <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Orden #{order.id.substring(0, 8)}</h3>
              <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", marginTop: "0.25rem" }}>Comprado el {new Date(order.created_at).toLocaleDateString("es-CL")}</p>
            </div>
            
            <div style={{ padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
              <div style={{ 
                width: "64px", height: "64px", borderRadius: "50%", 
                display: "flex", alignItems: "center", justifyContent: "center",
                background: `${getStatusDisplay(order.status).color}15`,
                color: getStatusDisplay(order.status).color
              }}>
                {getStatusDisplay(order.status).icon}
              </div>
              <h2 style={{ margin: 0, color: getStatusDisplay(order.status).color }}>{getStatusDisplay(order.status).text}</h2>
              <p style={{ textAlign: "center", color: "var(--color-text-muted)" }}>
                El paquete {order.status === "despachado" ? "va viajando hacia" : "será enviado a"}: <br/>
                <strong>{order.shipping_address}</strong>
              </p>
            </div>

            <div style={{ padding: "1.5rem", background: "var(--color-surface-2)", borderTop: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 600 }}>Total Pagado:</span>
              <span style={{ fontWeight: 700, fontSize: "1.2rem", color: "var(--color-primary)" }}>
                ${(order.total).toLocaleString("es-CL")}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
