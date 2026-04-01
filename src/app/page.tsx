import type { Metadata } from "next";
import Hero from "@/components/store/Hero";
import ProductCatalog from "@/components/store/ProductCatalog";

export const metadata: Metadata = {
  title: "TiendaBici — Accesorios de Ciclismo en Chile",
  description:
    "Encuentra multiherramientas, luces LED, protecciones y ropa de ciclismo. Envío a todo Chile.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <section className="section">
        <div className="container">
          <ProductCatalog />
        </div>
      </section>
    </>
  );
}
