import { createClient } from "@supabase/supabase-js";

// Cliente com service role — APENAS em server actions / route handlers.
// Bypassa RLS; nunca expor ao cliente.
export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("SUPABASE env vars não configuradas (URL / SERVICE_ROLE_KEY)");
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// Cliente anônimo (respeita RLS) — para uso futuro com supabase-js puro.
export function createSupabaseAnonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("SUPABASE env vars não configuradas (URL / ANON_KEY)");
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
