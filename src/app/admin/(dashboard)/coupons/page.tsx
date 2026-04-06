import { createClient } from "@/lib/supabase-server";

export default async function AdminCouponsPage() {
  const supabase = await createClient();
  const { data: coupons } = await supabase.from("coupons").select("*").order("discount_pct", { ascending: false });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", margin: 0 }}>Gestión de Cupones</h1>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Descuento</th>
              <th>Activo</th>
            </tr>
          </thead>
          <tbody>
            {!coupons || coupons.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ textAlign: "center", padding: "2rem" }}>No hay cupones creados</td>
              </tr>
            ) : (
              coupons.map((c) => (
                <tr key={c.id}>
                  <td><strong style={{ background: "var(--color-surface)", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>{c.code}</strong></td>
                  <td>{c.discount_pct}% OFF</td>
                  <td>
                    <span className={`product-card__stock ${c.active ? "" : "out"}`}>
                      {c.active ? "Sí" : "No"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
