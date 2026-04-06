"use server";

import { supabase } from "./supabase";
import type { DBProduct, DBOrder } from "./supabase";

// ── Products ────────────────────────────────────

export async function getProducts(): Promise<DBProduct[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching products:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getProductBySlug(slug: string): Promise<DBProduct | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching product:", error.message);
    return null;
  }
  return data;
}

export async function updateStock(productId: string, newStock: number): Promise<boolean> {
  const { error } = await supabase
    .from("products")
    .update({ stock: newStock })
    .eq("id", productId);

  if (error) {
    console.error("Error updating stock:", error.message);
    return false;
  }
  return true;
}

export async function createProduct(
  product: Omit<DBProduct, "id" | "created_at">
): Promise<DBProduct | null> {
  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select()
    .single();

  if (error) {
    console.error("Error creating product:", error.message);
    return null;
  }
  return data;
}

export async function deleteProduct(productId: string): Promise<boolean> {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) {
    console.error("Error deleting product:", error.message);
    return false;
  }
  return true;
}

// ── Orders ──────────────────────────────────────

export async function getOrders(): Promise<DBOrder[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error.message);
    return [];
  }
  return data ?? [];
}

export async function updateOrderStatus(
  orderId: string,
  status: DBOrder["status"]
): Promise<boolean> {
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) {
    console.error("Error updating order status:", error.message);
    return false;
  }
  return true;
}

// ── Dashboard Stats ──────────────────────────────

export async function getDashboardStats() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [productsRes, ordersRes, monthOrdersRes] = await Promise.all([
    supabase.from("products").select("id, stock"),
    supabase.from("orders").select("id, total, status"),
    supabase
      .from("orders")
      .select("total")
      .gte("created_at", startOfMonth)
      .eq("status", "pagado"),
  ]);

  const products = productsRes.data ?? [];
  const orders = ordersRes.data ?? [];
  const monthOrders = monthOrdersRes.data ?? [];

  const totalStock = products.reduce((sum, p) => sum + (p.stock ?? 0), 0);
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const outOfStock = products.filter((p) => p.stock === 0).length;
  const monthlySales = monthOrders.reduce((sum, o) => sum + (o.total ?? 0), 0);
  const totalOrders = orders.length;

  return { totalStock, lowStock, outOfStock, monthlySales, totalOrders };
}
