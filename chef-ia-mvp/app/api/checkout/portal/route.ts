import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/checkout/portal
 * Abre o Portal do Cliente do Stripe, onde a assinante pode trocar o cartão,
 * ver faturas e cancelar a assinatura — sem precisar construir essas telas manualmente.
 */
export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ erro: "Não autenticado." }, { status: 401 });
  }

  const { data: assinatura } = await supabase
    .from("assinaturas")
    .select("*")
    .eq("user_id", user.id)
    .eq("provedor", "stripe")
    .single();

  if (!assinatura) {
    return NextResponse.json({ erro: "Nenhuma assinatura Stripe encontrada para este usuário." }, { status: 404 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: assinatura.stripe_customer_id,
    return_url: `${request.headers.get("origin")}/assinatura`,
  });

  return NextResponse.json({ url: portalSession.url });
}
