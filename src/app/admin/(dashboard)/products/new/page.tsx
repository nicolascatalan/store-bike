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
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

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

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles(prev => [...prev, ...files]);
      const newPreviews = files.map(f => URL.createObjectURL(f));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imageFiles.length === 0) {
      alert("Por favor selecciona al menos una imagen para el producto.");
      return;
    }

    setLoading(true);

    try {
      // 1. Subir todas las imágenes
      setUploadingImage(true);
      const uploadedUrls: string[] = [];

      for (const file of imageFiles) {
        const fileData = new FormData();
        fileData.append("file", file);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: fileData,
        });

        if (!uploadRes.ok) throw new Error("Error subiendo una de las imágenes");
        const { url } = await uploadRes.json();
        uploadedUrls.push(url);
      }
      setUploadingImage(false);

      // 2. Crear el registro en base de datos
      const product = {
        name: formData.name,
        slug: formData.slug || generateSlug(formData.name),
        brand: formData.brand,
        price: parseInt(formData.price || "0"),
        category: formData.category,
        stock: parseInt(formData.stock || "0"),
        image: uploadedUrls[0], // Principal
        images: uploadedUrls,    // Galería
        description: formData.description,
        features: [],
        specs: {},
      };

      const res = await createProduct(product as any);
      if (res) {
        router.push("/admin/products");
        router.refresh();
      } else {
        alert("Error al crear. Asegúrate que el campo slug no esté repetido.");
      }
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error subiendo el producto.");
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
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <label className="label" style={{ marginBottom: "0.5rem", display: "block" }}>Fotografías del Producto</label>
            <label 
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: "2px dashed var(--color-border)",
                borderRadius: "12px",
                padding: "1.5rem",
                background: "var(--color-surface-2)",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s"
              }}>
              <input type="file" multiple accept="image/*" style={{ display: "none" }} onChange={handleImagesChange} />
              <UploadCloud size={32} style={{ color: "var(--color-primary)", marginBottom: "0.5rem" }} />
              <span style={{ fontWeight: 500, fontSize: "0.9rem" }}>Añadir imágenes</span>
              <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "0.25rem" }}>Puedes seleccionar varias</span>
            </label>
          </div>

          {/* Previews Grid */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", 
            gap: "0.75rem",
            maxHeight: "300px",
            overflowY: "auto",
            padding: "0.5rem"
          }}>
            {previews.map((src, i) => (
              <div key={i} style={{ position: "relative", aspectRatio: "1", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--color-border)" }}>
                <img src={src} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <button 
                  type="button" 
                  onClick={() => removeImage(i)}
                  style={{
                    position: "absolute",
                    top: "4px",
                    right: "4px",
                    background: "rgba(0,0,0,0.6)",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    fontSize: "12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <button 
            type="submit" 
            form="product-form"
            className="btn btn-primary btn-lg" 
            disabled={loading} 
            style={{ marginTop: "auto", width: "100%" }}>
            <Save size={18} /> 
            {uploadingImage ? "Subiendo fotos..." : loading ? "Guardando..." : "Publicar Producto"}
          </button>
        </div>
      </div>
    </div>
  );
}
