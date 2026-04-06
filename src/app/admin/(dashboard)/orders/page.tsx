import { getOrders } from "@/lib/actions";
import AdminOrdersClient from "./AdminOrdersClient";

export default async function AdminOrdersPage() {
  const orders = await getOrders();
  return <AdminOrdersClient orders={orders} />;
}
