"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { createProduct } from "@/lib/actions";
import Link from "next/link";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    brand: "",
    price: "",
    category: "herramientas",
    stock: "0",
    image: "/images/placeholder-tool.jpg",
    description: "",
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove accents
      .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric with dash
      .replace(/(^-|-$)+/g, ""); // remove leading/trailing dash
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, name: e.target.value, slug: generateSlug(e.target.value) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const product = {
      name: formData.name,
      slug: formData.slug || generateSlug(formData.name),
      brand: formData.brand,
      price: parseInt(formData.price || "0"),
      category: formData.category,
      stock: parseInt(formData.stock || "0"),
      image: formData.image,
      description: formData.description,
      features: [], // array basico por ahora
      specs: {}, // vacio por ahora
    };

    const res = await createProduct(product);
    setLoading(false);

    if (res) {
      router.push("/admin/products");
      router.refresh();
    } else {
      alert("Error al crear el producto. Quizás el slug ya existe.");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <Link href="/admin/products" className="btn btn-ghost btn-sm" style={{ marginBottom: "1rem" }}>
          <ArrowLeft size={16} /> Volver a Productos
        </Link>
        <h1>Añadir Nuevo Producto</h1>
      </div>

      <div className="admin-card" style={{ maxWidth: "600px" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label className="label">Nombre del Producto</label>
            <input type="text" className="input" required value={formData.name} onChange={handleNameChange} />
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <div style={{ flex: 1 }}>
              <label className="label">Slug (URL autogenerada)</label>
              <input type="text" className="input" required value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} />
            </div>
            <div style={{ flex: 1 }}>
              <label className="label">Marca</label>
              <input type="text" className="input" required value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} />
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <div style={{ flex: 1 }}>
              <label className="label">Precio (CLP)</label>
              <input type="number" className="input" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
            </div>
            <div style={{ flex: 1 }}>
              <label className="label">Stock Inicial</label>
              <input type="number" className="input" required value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <div style={{ flex: 1 }}>
              <label className="label">Categoría</label>
              <select className="input" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                <option value="herramientas">Herramientas</option>
                <option value="luces">Luces</option>
                <option value="protecciones">Protecciones</option>
                <option value="ropa">Ropa</option>
                <option value="repuestos">Repuestos</option>
                <option value="accesorios">Accesorios</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label className="label">Ruta de Imagen</label>
              <input type="text" className="input" required value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="label">Descripción</label>
            <textarea className="input" rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: "1rem", alignSelf: "flex-end" }}>
            <Save size={18} /> {loading ? "Guardando..." : "Guardar Producto"}
          </button>
        </form>
      </div>
    </div>
  );
}
