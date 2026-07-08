import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Protege as rotas internas (/dashboard, /clientes, /pedidos, /agenda,
 * /calculadora, /caixa, /assinatura) e o painel administrativo (/admin),
 * redirecionando para /login quando não há sessão válida.
 *
 * Ativa automaticamente assim que NEXT_PUBLIC_SUPABASE_URL e
 * NEXT_PUBLIC_SUPABASE_ANON_KEY estiverem preenchidos em .env.local.
 * Enquanto não configurado, o middleware não bloqueia nada (fail-open),
 * para não travar o MVP navegável em memória.
 */

const ROTAS_PROTEGIDAS = [
  "/dashboard",
  "/clientes",
  "/pedidos",
  "/agenda",
  "/calculadora",
  "/caixa",
  "/assinatura",
];

const ROTAS_ADMIN = ["/admin"];

export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const { pathname } = request.nextUrl;
  const protegida = ROTAS_PROTEGIDAS.some((r) => pathname.startsWith(r));
  const admin = ROTAS_ADMIN.some((r) => pathname.startsWith(r));

  if (!url || !anonKey || (!protegida && !admin)) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: any) {
        response.cookies.set({ name, value: "", ...options });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const redirectUrl = new URL("/login", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  if (admin) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/clientes/:path*",
    "/pedidos/:path*",
    "/agenda/:path*",
    "/calculadora/:path*",
    "/caixa/:path*",
    "/assinatura/:path*",
    "/admin/:path*",
  ],
};
