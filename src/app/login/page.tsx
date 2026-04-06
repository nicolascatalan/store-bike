"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });

    if (loginError) {
      setError("Credenciales incorrectas. Verifica tu email y contraseña.");
      setLoading(false);
      return;
    }

    // Success
    router.push("/");
    router.refresh(); // Important to update the navbar (it's a client component using Supabase)
  }

  return (
    <div className="section" style={{
      minHeight: "calc(100vh - 100px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--color-bg)",
    }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        {/* Card */}
        <div style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-xl)",
          padding: "2.5rem",
          boxShadow: "0 24px 64px rgba(0,0,0,0.1)",
        }}>
          <h1 style={{
            fontSize: "1.6rem",
            fontWeight: 700,
            marginBottom: "0.25rem",
            color: "var(--color-text)",
          }}>
            Bienvenido de nuevo
          </h1>
          <p style={{
            color: "var(--color-text-muted)",
            fontSize: "0.9rem",
            marginBottom: "2rem",
          }}>
            Ingresa a tu cuenta para gestionar tus compras.
          </p>

          {error && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              background: "rgba(239,68,68,0.05)",
              border: "1px solid rgba(239,68,68,0.15)",
              borderRadius: "var(--radius-md)",
              padding: "0.85rem 1rem",
              marginBottom: "1.5rem",
              color: "var(--color-danger)",
              fontSize: "0.88rem",
            }}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Email */}
            <div>
              <label className="form-label">Email</label>
              <div style={{ position: "relative" }}>
                <Mail size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }} />
                <input
                  type="email"
                  className="input"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  style={{ paddingLeft: "42px" }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "0.5rem" }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Contraseña</label>
                <Link href="/forgot-password" style={{ fontSize: "0.75rem", color: "var(--color-primary)", fontWeight: 500 }}>
                  Olvidé mi contraseña
                </Link>
              </div>
              <div style={{ position: "relative" }}>
                <Lock size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  className="input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  style={{ paddingLeft: "42px", paddingRight: "44px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--color-text-muted)",
                    padding: "4px",
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{
                width: "100%",
                justifyContent: "center",
                padding: "0.85rem",
                marginTop: "1rem",
              }}
            >
              {loading ? "Verificando..." : "Entrar ahora"}
              {!loading && <ArrowRight size={18} style={{ marginLeft: "0.5rem" }} />}
            </button>
          </form>

          <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.9rem" }}>
            <span style={{ color: "var(--color-text-muted)" }}>¿No tienes cuenta? </span>
            <Link href="/register" style={{ color: "var(--color-primary)", fontWeight: 600 }}>Crea una gratis</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
