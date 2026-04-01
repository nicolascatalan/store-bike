export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  description: string;
  features?: string[];
  specs?: Record<string, string>;
}

export const PRODUCTS: Product[] = [
  {
    id: "1",
    slug: "multiherramienta-negro-one-up",
    name: "Multiherramienta 9 funciones One Up",
    brand: "One Up",
    price: 54990,
    category: "herramientas",
    stock: 15,
    image: "/images/placeholder-tool.jpg",
    description: "La multiherramienta compacta definitiva para tus rutas. Llaves Allen 2-8mm, Torx T25, destornillador plano. Solo 75g para llevar en cualquier bolsillo.",
    features: [
      "Llaves Allen 2mm, 2.5mm, 3mm, 4mm, 5mm, 6mm, 8mm",
      "Llave Torx T25",
      "Destornillador plano",
      "Peso: solo 75g",
      "Cuerpo de aluminio anodizado",
    ],
    specs: {
      Peso: "75g",
      Material: "Aluminio 6061",
      Funciones: "9",
      Compatibilidad: "Universal",
    },
  },
  {
    id: "2",
    slug: "luz-delantera-led-500lm",
    name: "Luz Delantera LED 500lm",
    brand: "Lezyne",
    price: 39990,
    category: "luces",
    stock: 8,
    image: "/images/placeholder-light.jpg",
    description: "Ilumina cada curva con 500 lúmenes de potencia. Recargable USB-C, 3 modos de iluminación y resistente al agua IPX7.",
    features: [
      "500 lúmenes de potencia máxima",
      "Carga rápida USB-C",
      "Modos: Alto / Medio / Flash",
      "Resistencia al agua IPX7",
      "Batería: 2200mAh / hasta 8h",
    ],
    specs: {
      Lúmenes: "500lm",
      Autonomía: "Hasta 8 horas",
      Carga: "USB-C",
      Impermeabilidad: "IPX7",
    },
  },
  {
    id: "3",
    slug: "casco-mtb-enduro-negro",
    name: "Casco MTB Enduro",
    brand: "Fox Racing",
    price: 129990,
    category: "protecciones",
    stock: 3,
    image: "/images/placeholder-helmet.jpg",
    description: "Protección certificada MIPS para los riders más exigentes. Ventilación máxima con carcasa dura para enduro y DH.",
    features: [
      "Certificación MIPS anti-rotación",
      "Carcasa In-Mold de alta densidad",
      "18 canales de ventilación",
      "Visera ajustable de 3 posiciones",
      "Forro interior lavable",
    ],
    specs: {
      Certificación: "MIPS / CE EN1078",
      Talla: "M (55-59cm)",
      Peso: "480g",
      Ventilación: "18 canales",
    },
  },
  {
    id: "4",
    slug: "guantes-mtb-negro-naranjo",
    name: "Guantes MTB Full Finger",
    brand: "Fox Racing",
    price: 34990,
    category: "ropa",
    stock: 0,
    image: "/images/placeholder-gloves.jpg",
    description: "Agarre y protección para tus rides más técnicos. Palma de cuero sintético reforzado, cierre de velcro ajustable.",
    features: [
      "Palma de cuero sintético reforzado",
      "Nudillos con gel protector",
      "Cierre de velcro ergonómico",
      "Compatible con pantallas táctiles",
    ],
    specs: {
      Material: "Cuero sintético / Licra",
      Talla: "M",
      Dedos: "Full Finger",
      Pantalla: "Compatible",
    },
  },
  {
    id: "5",
    slug: "bomba-co2-16g",
    name: "Bomba CO₂ 16g",
    brand: "Topeak",
    price: 18990,
    category: "herramientas",
    stock: 22,
    image: "/images/placeholder-pump.jpg",
    description: "Inflado ultrarrápido en segundos. Cabezal universal para válvulas Presta y Schrader. Indispensable para salidas largas.",
    features: [
      "Inflado en menos de 10 segundos",
      "Compatible válvulas Presta y Schrader",
      "Cartucho 16g incluido",
      "Gatillo de control de flujo",
      "Cabezal con aislante térmico",
    ],
    specs: {
      Cartucho: "16g CO₂",
      Válvulas: "Presta / Schrader",
      Peso: "52g",
      Presión: "Hasta 7.9 bar / 115 PSI",
    },
  },
  {
    id: "6",
    slug: "luz-trasera-led-rojo",
    name: "Luz Trasera LED Roja",
    brand: "Lezyne",
    price: 19990,
    category: "luces",
    stock: 2,
    image: "/images/placeholder-rearlight.jpg",
    description: "Sé visible desde lejos. 70 lúmenes LED rojo, recargable USB, resistente al agua. Montaje universal para tija o alforja.",
    features: [
      "70 lúmenes máximos",
      "LED rojo de alta visibilidad",
      "Recargable USB micro",
      "Modos: Constante / Flash / DayFlash",
      "Montaje 360° ajustable",
    ],
    specs: {
      Lúmenes: "70lm",
      Autonomía: "Hasta 12 horas (flash)",
      Carga: "USB Micro",
      Impermeabilidad: "IPX7",
    },
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getRelatedProducts(product: Product, limit = 3): Product[] {
  return PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category).slice(0, limit);
}
