import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/checkout
 * Body: { plano: "fundador" | "pro" }
 * Cria uma sessão de checkout do Stripe para o plano escolhido e retorna a URL de redirecionamento.
 *
 * Regra do plano Fundador: antes de criar a sessão com STRIPE_PRICE_ID_FUNDADOR,
 * verifique no banco (contar_fundadores()) se ainda restam vagas das 100 —
 * caso contrário, force o plano "pro" mesmo que o front peça "fundador".
 */
export async function POST(request: Request) {
  const { plano } = (await request.json()) as { plano: "fundador" | "pro" };

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ erro: "Você precisa estar logada para assinar." }, { status: 401 });
  }

  let planoFinal = plano;
  if (plano === "fundador") {
    const { data: vagas } = await supabase.rpc("contar_fundadores");
    if ((vagas ?? 0) >= 100) {
      planoFinal = "pro";
    }
  }

  const priceId =
    planoFinal === "fundador"
      ? process.env.STRIPE_PRICE_ID_FUNDADOR
      : process.env.STRIPE_PRICE_ID_PRO;

  if (!priceId) {
    return NextResponse.json(
      { erro: "Stripe ainda não está configurado (faltam as variáveis de ambiente)." },
      { status: 500 }
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: user.email ?? undefined,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${request.headers.get("origin")}/dashboard?assinatura=sucesso`,
    cancel_url: `${request.headers.get("origin")}/assinatura`,
    metadata: { user_id: user.id, plano: planoFinal },
  });

  return NextResponse.json({ url: session.url });
}
