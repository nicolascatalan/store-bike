import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ────────────────────────────────────────────────
// Types that mirror the Supabase tables
// ────────────────────────────────────────────────

export interface DBProduct {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  description: string;
  features: string[] | null;
  specs: Record<string, string> | null;
  created_at: string;
}

export interface DBOrder {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  status: "pendiente" | "pagado" | "enviado" | "entregado" | "cancelado";
  total: number;
  created_at: string;
  order_items?: DBOrderItem[];
}

export interface DBOrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  products?: DBProduct;
}

export interface DBReview {
  id: string;
  product_id: string;
  author_name: string;
  rating: number;
  comment: string;
  created_at: string;
}
