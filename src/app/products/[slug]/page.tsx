import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/actions";
import ProductClient from "./ProductClient";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const p = await params;
  const product = await getProductBySlug(p.slug);
  
  if (!product) return { title: "Producto no encontrado" };

  return {
    title: `${product.name} | TiendaBici`,
    description: product.description.substring(0, 160),
    openGraph: {
      title: `${product.name} - $${product.price.toLocaleString("es-CL")} CLP`,
      description: product.description.substring(0, 160),
      images: [
        {
          url: product.image?.startsWith("http") 
            ? product.image 
            : `http://localhost:3000${product.image || "/images/placeholder-tool.jpg"}`,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await params;
  const product = await getProductBySlug(p.slug);

  if (!product) {
    notFound();
  }

  return <ProductClient product={product} />;
}
