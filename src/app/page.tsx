import type { Metadata } from "next";
import Hero from "@/components/store/Hero";
import ProductCatalog from "@/components/store/ProductCatalog";
import { createClient } from "@/lib/supabase-server";

export const metadata: Metadata = {
  title: "TiendaBici — Accesorios de Ciclismo en Chile",
  description:
    "Encuentra multiherramientas, luces LED, protecciones y ropa de ciclismo. Envío a todo Chile.",
};

export const revalidate = 0; // Para que recargue cambios inmediatamente

export default async function HomePage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <>
      <Hero />
      <section className="section">
        <div className="container">
          <ProductCatalog products={products || []} />
        </div>
      </section>
    </>
  );
}
