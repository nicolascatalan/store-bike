"use client";

import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useState } from "react";

export default function AdminLogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    setLoading(true);
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      id="admin-logout-btn"
      onClick={handleLogout}
      disabled={loading}
      className="admin-nav__link"
      style={{
        width: "100%",
        border: "none",
        background: "none",
        cursor: loading ? "wait" : "pointer",
        color: "var(--color-danger)",
        opacity: loading ? 0.6 : 1,
        textAlign: "left",
      }}
    >
      <LogOut size={20} />
      <span>{loading ? "Cerrando..." : "Cerrar sesión"}</span>
    </button>
  );
}
