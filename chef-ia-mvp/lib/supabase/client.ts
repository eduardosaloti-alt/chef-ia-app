import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente Supabase para Client Components.
 * Requer as variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e
 * NEXT_PUBLIC_SUPABASE_ANON_KEY (ver .env.example).
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
