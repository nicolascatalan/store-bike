import { createClient } from "@/lib/supabase-server";

export default async function AdminReviewsPage() {
  const supabase = await createClient();
  // Call reviews with joined product name
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, products(name)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", margin: 0 }}>Gestión de Reseñas</h1>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Autor</th>
              <th>Producto</th>
              <th>Calificación</th>
              <th>Comentario</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {!reviews || reviews.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "2rem" }}>No hay reseñas recibidas</td>
              </tr>
            ) : (
              reviews.map((rev: any) => (
                <tr key={rev.id}>
                  <td><strong>{rev.author_name}</strong></td>
                  <td style={{ fontSize: "0.85rem", color: "var(--color-primary)" }}>{rev.products?.name || "Eliminado"}</td>
                  <td>
                    <span style={{ color: "#fbbf24", fontWeight: "bold" }}>★ {rev.rating}</span>
                  </td>
                  <td style={{ maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    "{rev.comment}"
                  </td>
                  <td style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                    {new Date(rev.created_at).toLocaleDateString("es-CL")}
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
