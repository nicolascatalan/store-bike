import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { CartProvider } from "@/lib/cart";
import { WishlistProvider } from "@/lib/wishlist";

export const metadata: Metadata = {
  title: {
    default: "TiendaBici — Accesorios de Ciclismo",
    template: "%s | TiendaBici",
  },
  description:
    "Accesorios de ciclismo de alta calidad: multiherramientas, luces, protecciones y más. Envío a todo Chile.",
  keywords: ["bicicleta", "accesorios ciclismo", "multiherramienta", "ciclismo chile"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <CartProvider>
          <WishlistProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
