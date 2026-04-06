import { createClient } from "@/lib/supabase-server";
import { createCoupon } from "@/lib/actions";

export default async function AdminCouponsPage() {
  const supabase = await createClient();
  const { data: coupons } = await supabase.from("coupons").select("*").order("discount_pct", { ascending: false });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", margin: 0 }}>Gestión de Cupones</h1>
      </div>

      <div className="admin-card" style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Crear Nuevo Cupón</h2>
        <form action={createCoupon} style={{ display: "flex", gap: "1rem", alignItems: "flex-end", flexWrap: "wrap" }}>
          <div>
            <label className="form-label">Código (ej. VERANO24)</label>
            <input type="text" name="code" className="input" placeholder="INGRESA_CODIGO" required style={{ width: "200px" }} />
          </div>
          <div>
            <label className="form-label">Descuento (%)</label>
            <input type="number" name="discount_pct" className="input" min="1" max="100" placeholder="15" required style={{ width: "120px" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", paddingBottom: "0.5rem" }}>
            <input type="checkbox" name="active" defaultChecked id="active-cb" />
            <label htmlFor="active-cb" style={{ fontSize: "0.9rem" }}>Activo</label>
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: "0.5rem 1.5rem", height: "42px" }}>Crear Cupón</button>
        </form>
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
