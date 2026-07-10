import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient as createServiceClient } from "@supabase/supabase-js";

/**
 * POST /api/webhooks/stripe
 * Recebe eventos de assinatura do Stripe e sincroniza com o Supabase.
 *
 * Configure o endpoint no painel do Stripe apontando para:
 *   https://SEU-DOMINIO/api/webhooks/stripe
 *
 * Usa a Service Role Key (não a anon key) porque este código roda no
 * servidor, sem sessão de usuário, e precisa de permissão para escrever
 * em qualquer linha (bypassando o RLS).
 */
function supabaseAdmin() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ erro: "Assinatura inválida do webhook." }, { status: 400 });
  }

  const supabase = supabaseAdmin();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;
      const plano = session.metadata?.plano ?? "pro";
      if (userId) {
        await supabase.from("assinaturas").insert({
          user_id: userId,
          provedor: "stripe",
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          status: "ativa",
          plano,
        });
        await supabase
          .from("profiles")
          .update({
            plano,
            fundador: plano === "fundador",
            preco_travado: plano === "fundador" ? 19.9 : 29.9,
          })
          .eq("id", userId);
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      await supabase
        .from("assinaturas")
        .update({ status: subscription.status === "active" ? "ativa" : subscription.status })
        .eq("stripe_subscription_id", subscription.id);
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await supabase
        .from("assinaturas")
        .update({ status: "cancelada" })
        .eq("stripe_subscription_id", subscription.id);
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      await supabase
        .from("assinaturas")
        .update({ status: "inadimplente" })
        .eq("stripe_customer_id", invoice.customer as string);
      break;
    }
  }

  return NextResponse.json({ recebido: true });
}
