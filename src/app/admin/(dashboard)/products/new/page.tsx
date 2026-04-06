"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, UploadCloud } from "lucide-react";
import { createProduct } from "@/lib/actions";
import Link from "next/link";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    brand: "",
    price: "",
    category: "herramientas",
    stock: "0",
    description: "",
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, name: e.target.value, slug: generateSlug(e.target.value) });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      alert("Por favor selecciona una imagen para el producto.");
      return;
    }

    setLoading(true);

    try {
      // 1. Subir la imagen al servidor proxy que carga al Storage
      setUploadingImage(true);
      const fileData = new FormData();
      fileData.append("file", imageFile);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: fileData,
      });

      if (!uploadRes.ok) throw new Error("Error subiendo imagen");
      const { url } = await uploadRes.json();
      setUploadingImage(false);

      // 2. Crear el registro en base de datos con la URL publica
      const product = {
        name: formData.name,
        slug: formData.slug || generateSlug(formData.name),
        brand: formData.brand,
        price: parseInt(formData.price || "0"),
        category: formData.category,
        stock: parseInt(formData.stock || "0"),
        image: url, // La URL de Supabase Storage
        description: formData.description,
        features: [],
        specs: {},
      };

      const res = await createProduct(product);
      if (res) {
        router.push("/admin/products");
        router.refresh();
      } else {
        alert("Error al crear. Asegúrate que el campo slug no esté repetido con otro producto.");
      }
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error general subiendo el producto.");
    } finally {
      setLoading(false);
      setUploadingImage(false);
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

      <div className="admin-card" style={{ maxWidth: "800px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        {/* Formulario Izquierdo */}
        <form id="product-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label className="label">Nombre del Producto</label>
            <input type="text" className="input" required value={formData.name} onChange={handleNameChange} />
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <div style={{ flex: 1 }}>
              <label className="label">Slug (URL)</label>
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

          <div>
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

          <div>
            <label className="label">Descripción</label>
            <textarea className="input" rows={6} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>
        </form>

        {/* Panel Derecho de Imagen */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <label className="label">Fotografía del Producto</label>
          <label 
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: "2px dashed var(--color-border)",
              borderRadius: "12px",
              padding: "2rem",
              background: "var(--color-surface-2)",
              cursor: "pointer",
              height: "250px",
              textAlign: "center",
              overflow: "hidden",
              position: "relative"
            }}>
            <input type="file" required accept="image/*" style={{ display: "none" }} onChange={handleImageChange} />
            
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "contain", position: "absolute", top: 0, left: 0 }} />
            ) : (
              <>
                <UploadCloud size={48} style={{ color: "var(--color-primary)", marginBottom: "1rem" }} />
                <span style={{ fontWeight: 500 }}>Haz clic para subir imagen</span>
                <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: "0.5rem" }}>PNG, JPG o WEBP (Máx. 2MB)</span>
              </>
            )}
          </label>

          <button 
            type="submit" 
            form="product-form"
            className="btn btn-primary btn-lg" 
            disabled={loading} 
            style={{ marginTop: "auto" }}>
            <Save size={18} /> 
            {uploadingImage ? "Subiendo foto..." : loading ? "Guardando..." : "Publicar Producto"}
          </button>
        </div>
      </div>
    </div>
  );
}
