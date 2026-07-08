import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Rota chamada pelo Supabase após o login com Google.
 * Configure esta URL como Redirect URL no painel do Supabase:
 *   https://SEU-DOMINIO/auth/callback
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
