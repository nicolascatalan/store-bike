import { getProducts } from "@/lib/actions";
import AdminInventoryClient from "./AdminInventoryClient";

export default async function AdminInventoryPage() {
  const products = await getProducts();
  return <AdminInventoryClient products={products} />;
}
