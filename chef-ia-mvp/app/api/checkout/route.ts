import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/checkout
 * Cria uma sessão de checkout do Stripe para a assinatura da Chef IA (preço único
 * de R$29,90/mês, com 15 dias de trial grátis) e retorna a URL de redirecionamento.
 *
 * Promoção "Fundadora": enquanto restarem vagas das 100 primeiras
 * (contar_fundadores() < 100), aplicamos automaticamente o cupom
 * STRIPE_COUPON_ID_FUNDADOR (R$10 de desconto vitalício -> R$19,90/mês para sempre).
 * Se o cupom não puder ser aplicado (ex: esgotou nesse instante), seguimos sem
 * desconto em vez de falhar o checkout.
 */
export async function POST(request: Request) {
    const supabase = createClient();
    const {
          data: { user },
    } = await supabase.auth.getUser();

  if (!user) {
        return NextResponse.json({ erro: "Você precisa estar logada para assinar." }, { status: 401 });
  }

  const priceId = process.env.STRIPE_PRICE_ID_PRO;
    const couponId = process.env.STRIPE_COUPON_ID_FUNDADOR;

  if (!priceId) {
        return NextResponse.json(
          { erro: "Stripe ainda não está configurado (faltam as variáveis de ambiente)." },
          { status: 500 }
              );
  }

  const { data: vagas } = await supabase.rpc("contar_fundadores");
    const aindaHaVagas = (vagas ?? 0) < 100;

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const origin = request.headers.get("origin");

  function montarSessao(comCupom: boolean) {
        return stripe.checkout.sessions.create({
                mode: "subscription",
                customer_email: user.email ?? undefined,
                line_items: [{ price: priceId!, quantity: 1 }],
                subscription_data: { trial_period_days: 15 },
                ...(comCupom && couponId ? { discounts: [{ coupon: couponId }] } : {}),
                success_url: `${origin}/dashboard?assinatura=sucesso`,
                cancel_url: `${origin}/assinatura`,
                metadata: { user_id: user.id, plano: comCupom && couponId ? "fundador" : "pro" },
        });
  }

  let session;
    try {
          session = await montarSessao(aindaHaVagas);
    } catch (erroCupom) {
          if (aindaHaVagas) {
                  session = await montarSessao(false);
          } else {
                  throw erroCupom;
          }
    }

  return NextResponse.json({ url: session.url });
}
