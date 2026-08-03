import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { createHmac } from "crypto";

/**
* POST /api/webhooks/kiwify
*
* Recebe os eventos de pagamento da Kiwify e sincroniza o plano da assinante
* nas tabelas `profiles` e `assinaturas`.
*
* Configuracao necessaria (.env.local / Vercel):
* - KIWIFY_WEBHOOK_TOKEN: o token secreto do webhook (definido ao criar o
                                                      * webhook no painel da Kiwify: Apps -> Webhooks -> Criar Webhook).
* - NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY (ja usadas pelo
                                                          * webhook do Stripe).
*
* No painel da Kiwify, aponte o webhook para:
* https://SEU-DOMINIO/api/webhooks/kiwify
* Eventos a marcar: Compra aprovada, Assinatura renovada, Assinatura
* cancelada, Assinatura atrasada.
*
* A Kiwify assina cada requisicao com um parametro "signature" na query
* string (HMAC-SHA1 do corpo bruto usando o token do webhook). Validamos
* essa assinatura abaixo antes de confiar em qualquer dado do payload.
*/

type PlanoInfo = { plano: string; valor: number; fundador: boolean };

// Mapeia o codigo curto do link de checkout da Kiwify (campo "checkout_link"
                                                        // do payload) para o plano correspondente no nosso sistema.
const PLANOS_POR_CHECKOUT: Record<string, PlanoInfo> = {
  "2Qutuft": { plano: "fundador", valor: 19.9, fundador: true }, // Fundadora original
  "20qPSqL": { plano: "pro", valor: 29.9, fundador: false }, // Pro antigo (pos 100 vagas, sem as novas funcoes)
  "SXfi1iN": { plano: "premium", valor: 39.9, fundador: false }, // PRO novo, assinante nova
  "AuyBgZQ": { plano: "premium", valor: 29.9, fundador: true }, // PRO novo, upgrade de fundadora
  };

function supabaseAdmin() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }

function assinaturaValida(corpoBruto: string, assinaturaRecebida: string | null): boolean {
  if (!assinaturaRecebida) return false;
  const token = process.env.KIWIFY_WEBHOOK_TOKEN;
  if (!token) return false;
  const calculada = createHmac("sha1", token).update(corpoBruto).digest("hex");
  return calculada === assinaturaRecebida;
  }

async function buscarUserIdPorEmail(email: string): Promise<string | null> {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users?email=${encodeURIComponent(email)}`;
  const resposta = await fetch(url, {
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
      },
    });
  if (!resposta.ok) return null;
  const dados = await resposta.json();
  const usuarios = dados.users ?? dados;
  return usuarios?.[0]?.id ?? null;
  }

async function atualizarAssinatura(
  supabase: ReturnType<typeof createServiceClient>,
  userId: string,
  status: string,
  plano: string,
  valor: number,
  proximaCobranca: string | null
  ) {
  const { data } = await supabase
  .from("assinaturas")
  .update({ status, plano, valor, proxima_cobranca: proximaCobranca })
  .eq("user_id", userId)
  .eq("provedor", "kiwify")
  .select();

  if (!data || data.length === 0) {
    await supabase.from("assinaturas").insert({
      user_id: userId,
      provedor: "kiwify",
      status,
      plano,
      valor,
      proxima_cobranca: proximaCobranca,
      });
    }
  }

export async function POST(request: Request) {
  const corpoBruto = await request.text();
  const signature = new URL(request.url).searchParams.get("signature");

  if (!assinaturaValida(corpoBruto, signature)) {
    return NextResponse.json({ erro: "Assinatura invalida do webhook." }, { status: 400 });
    }

  const payload = JSON.parse(corpoBruto);
  const evento = payload.webhook_event_type as string | undefined;
  const checkoutLink = payload.checkout_link as string | undefined;
  const email = payload.Customer?.email as string | undefined;
  const proximaCobranca = payload.Subscription?.next_payment ?? null;

  if (!evento || !checkoutLink || !email) {
    return NextResponse.json({ ok: true, aviso: "Payload sem dados suficientes, ignorado." });
    }

  const planoInfo = PLANOS_POR_CHECKOUT[checkoutLink];
  if (!planoInfo) {
    return NextResponse.json({ ok: true, aviso: `checkout_link ${checkoutLink} nao mapeado.` });
    }

  const supabase = supabaseAdmin();
  const userId = await buscarUserIdPorEmail(email);

  if (!userId) {
    return NextResponse.json({ ok: true, aviso: `Nenhuma usuaria encontrada para ${email}.` });
    }

  if (evento === "order_approved" || evento === "subscription_renewed") {
    await supabase
    .from("profiles")
    .update({
      plano: planoInfo.plano,
      fundador: planoInfo.fundador,
      preco_travado: planoInfo.valor,
      })
    .eq("id", userId);

    await atualizarAssinatura(supabase, userId, "ativa", planoInfo.plano, planoInfo.valor, proximaCobranca);
    } else if (evento === "subscription_canceled") {
    await supabase
    .from("profiles")
    .update({ plano: "gratuito", fundador: false, preco_travado: null })
    .eq("id", userId);

    await atualizarAssinatura(supabase, userId, "cancelada", planoInfo.plano, planoInfo.valor, null);
    } else if (evento === "subscription_late") {
          // Corta o acesso da assinante enquanto o pagamento estiver atrasado.
          await supabase
            .from("profiles")
            .update({ plano: "gratuito", fundador: false, preco_travado: null })
            .eq("id", userId);

          await atualizarAssinatura(supabase, userId, "atrasada", planoInfo.plano, planoInfo.valor, null);
  }

  return NextResponse.json({ ok: true });
  }
