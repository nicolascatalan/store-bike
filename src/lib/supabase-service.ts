import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase con Service Role Key.
 * SOLO para uso en API Routes / Route Handlers del servidor.
 * Bypasea RLS — NO exponer al cliente.
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createSupabaseClient(url, key, {
    auth: { persistSession: false },
  });
}
