import { getOrders, getDashboardStats } from "@/lib/actions";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminDashboardPage() {
  const [orders, stats] = await Promise.all([getOrders(), getDashboardStats()]);
  return <AdminDashboardClient orders={orders} stats={stats} />;
}
