import { createServerClient } from "@supabase/ssr";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Protege as rotas internas (/dashboard, /clientes, /pedidos, /agenda,
 * /calculadora, /caixa, /assinatura) e o painel administrativo (/admin),
 * redirecionando para /login quando nao ha sessao valida.
 *
 * Alem disso, exige assinatura ativa (ou em periodo de teste) para
 * acessar as rotas internas, exceto a propria pagina /assinatura.
 * Quem ainda nao tem assinatura e redirecionado para /assinatura,
 * garantindo que o cartao seja cadastrado e o trial de 15 dias comece
 * a contar antes de liberar o uso do produto.
 *
 * Ativa automaticamente assim que NEXT_PUBLIC_SUPABASE_URL e
 * NEXT_PUBLIC_SUPABASE_ANON_KEY estiverem preenchidos em .env.local.
 * Enquanto nao configurado, o middleware nao bloqueia nada (fail-open),
 * para nao travar o MVP navegavel em memoria.
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

const ROTAS_SEM_ASSINATURA = ["/assinatura"];

const STATUS_LIBERADOS = ["ativa", "trialing"];

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

const precisaAssinatura =
  protegida && !ROTAS_SEM_ASSINATURA.some((r) => pathname.startsWith(r));
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (precisaAssinatura && serviceKey) {
  const supabaseAdmin = createServiceClient(url, serviceKey);
  const { data: assinatura } = await supabaseAdmin
  .from("assinaturas")
  .select("status")
  .eq("user_id", user.id)
  .order("id", { ascending: false })
  .limit(1)
  .maybeSingle();

  const assinaturaAtiva =
    assinatura && STATUS_LIBERADOS.includes(assinatura.status);

  if (!assinaturaAtiva) {
    return NextResponse.redirect(new URL("/assinatura", request.url));
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
