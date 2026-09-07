import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

/**
 * POST /api/webhooks/kiwify
 *
 * Recebe as notificações de venda da Kiwify e cadastra a compradora
 * automaticamente no Supabase, com a senha padrão "chefia26", liberando
 * o acesso ao Chef IA sem ela precisar se cadastrar manualmente.
 *
 * Configuração necessária no painel da Kiwify (Configurações > Webhooks):
 *   URL: https://SEU-DOMINIO/api/webhooks/kiwify?signature=SEU_TOKEN_SECRETO
 *   Eventos: compra aprovada (e, se quiser cancelar acesso automaticamente,
 *   também reembolso/chargeback/assinatura cancelada).
 *
 * O "SEU_TOKEN_SECRETO" acima deve ser o mesmo valor salvo na variável de
 * ambiente KIWIFY_WEBHOOK_TOKEN (na Vercel). Se essa variável não estiver
 * configurada, o webhook aceita qualquer chamada — configure-a assim que
 * possível por segurança.
 *
 * A Kiwify pode mudar levemente os nomes dos campos do payload conforme o
 * tipo de produto/checkout. Por isso as funções abaixo tentam vários
 * caminhos possíveis pra achar o e-mail e o status do pedido. Se um pedido
 * real não bater com nenhum desses formatos, o corpo completo fica
 * registrado no log da função (Vercel > seu projeto > Logs) pra ajustar.
 */

const SENHA_PADRAO = "chefia26";

const STATUS_APROVADOS = ["paid", "approved", "aprovado", "completed", "compra_aprovada"];
const EVENTOS_APROVADOS = ["order_approved", "compra_aprovada", "purchase_approved", "sale_approved"];

const STATUS_CANCELADOS = ["refunded", "chargedback", "chargeback", "refused", "recusado", "cancelled", "canceled"];
const EVENTOS_CANCELADOS = [
  "order_refunded",
  "compra_reembolsada",
  "chargeback",
  "compra_recusada",
  "subscription_canceled",
  "assinatura_cancelada",
];

function supabaseAdmin() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function primeiro<T>(...valores: (T | null | undefined)[]): T | null {
  for (const v of valores) {
    if (v !== null && v !== undefined && v !== "") return v;
  }
  return null;
}

function extrairEmail(body: any): string | null {
  const email = primeiro<string>(
    body?.Customer?.email,
    body?.customer?.email,
    body?.data?.Customer?.email,
    body?.data?.customer?.email,
    body?.email
  );
  return email ? email.trim().toLowerCase() : null;
}

function extrairNome(body: any): string {
  return (
    primeiro<string>(
      body?.Customer?.full_name,
      body?.Customer?.first_name,
      body?.customer?.full_name,
      body?.data?.Customer?.full_name,
      body?.full_name
    ) ?? ""
  );
}

function extrairOrderId(body: any): string | null {
  return primeiro<string>(body?.order_id, body?.data?.order_id, body?.id);
}

function extrairStatusEEvento(body: any) {
  const status = String(primeiro<string>(body?.order_status, body?.data?.order_status) ?? "").toLowerCase();
  const evento = String(
    primeiro<string>(body?.webhook_event_type, body?.data?.webhook_event_type) ?? ""
  ).toLowerCase();
  return { status, evento };
}

function pedidoFoiAprovado(body: any): boolean {
  const { status, evento } = extrairStatusEEvento(body);
  return STATUS_APROVADOS.includes(status) || EVENTOS_APROVADOS.includes(evento);
}

function pedidoFoiCancelado(body: any): boolean {
  const { status, evento } = extrairStatusEEvento(body);
  return STATUS_CANCELADOS.includes(status) || EVENTOS_CANCELADOS.includes(evento);
}

/**
 * A API de administração do Supabase (nesta versão do supabase-js) não tem
 * um "buscar por e-mail" direto, então paginamos os usuários e filtramos
 * aqui. Funciona bem até alguns milhares de usuárias.
 */
async function buscarUsuarioPorEmail(supabase: ReturnType<typeof supabaseAdmin>, email: string) {
  const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) {
    console.error("Erro ao listar usuárias no Supabase:", error.message);
    return null;
  }
  return data.users.find((u) => u.email?.toLowerCase() === email) ?? null;
}

export async function POST(request: NextRequest) {
  const tokenEsperado = process.env.KIWIFY_WEBHOOK_TOKEN;
  const tokenRecebido =
    request.nextUrl.searchParams.get("signature") ?? request.nextUrl.searchParams.get("token");

  if (tokenEsperado && tokenRecebido !== tokenEsperado) {
    return NextResponse.json({ erro: "Token de webhook inválido" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ erro: "Corpo da requisição inválido" }, { status: 400 });
  }

  console.log("📩 Webhook Kiwify recebido:", JSON.stringify(body).slice(0, 4000));

  const supabase = supabaseAdmin();
  const email = extrairEmail(body);

  if (pedidoFoiAprovado(body)) {
    if (!email) {
      console.error("Webhook Kiwify: pedido aprovado mas não encontrei o e-mail da cliente no payload.");
      return NextResponse.json({ erro: "E-mail da cliente não encontrado no payload" }, { status: 400 });
    }

    const nome = extrairNome(body);
    const orderId = extrairOrderId(body);

    let userId: string | undefined;
    let contaNova = false;

    const { data: criado, error: erroCriacao } = await supabase.auth.admin.createUser({
      email,
      password: SENHA_PADRAO,
      email_confirm: true,
      user_metadata: { nome, nome_negocio: "" },
    });

    if (erroCriacao) {
      // E-mail já tem conta (ex: renovação, ou ela já havia se cadastrado
      // antes de comprar) — não é erro, só não mexemos na senha dela.
      const jaExiste =
        erroCriacao.message?.toLowerCase().includes("already") ||
        erroCriacao.message?.toLowerCase().includes("registrad") ||
        (erroCriacao as any).status === 422;

      if (!jaExiste) {
        console.error("Erro ao criar usuária no Supabase:", erroCriacao.message);
        return NextResponse.json({ erro: "Erro ao criar usuária" }, { status: 500 });
      }

      const usuariaExistente = await buscarUsuarioPorEmail(supabase, email);
      if (!usuariaExistente) {
        console.error(`Webhook Kiwify: e-mail ${email} já existe mas não foi encontrado na listagem.`);
        return NextResponse.json({ erro: "Não foi possível localizar a usuária" }, { status: 500 });
      }
      userId = usuariaExistente.id;
    } else {
      userId = criado.user?.id;
      contaNova = true;
    }

    if (!userId) {
      console.error("Webhook Kiwify: não obtive o ID da usuária depois de criar/localizar a conta.");
      return NextResponse.json({ erro: "Erro ao identificar a usuária" }, { status: 500 });
    }

    // Libera o acesso ao plano Pro (mesmo plano vendido no checkout /api/checkout).
    const { error: erroPerfil } = await supabase
      .from("profiles")
      .update({ plano: "pro", preco_travado: 29.9 })
      .eq("id", userId);
    if (erroPerfil) {
      console.error(`Erro ao atualizar o perfil da usuária ${userId}:`, erroPerfil.message);
    }

    const { error: erroAssinatura } = await supabase.from("assinaturas").insert({
      user_id: userId,
      provedor: "kiwify",
      status: "ativa",
      plano: "pro",
      valor: 29.9,
      kiwify_order_id: orderId,
    });
    if (erroAssinatura) {
      console.error(`Erro ao registrar assinatura Kiwify da usuária ${userId}:`, erroAssinatura.message);
    }

    console.log(
      `✅ ${contaNova ? "Conta criada" : "Conta já existia, acesso liberado"} para ${email} (user_id ${userId}).`
    );
    return NextResponse.json({ ok: true, contaNova });
  }

  if (pedidoFoiCancelado(body)) {
    if (!email) {
      console.warn("Webhook Kiwify: evento de cancelamento sem e-mail no payload.");
      return NextResponse.json({ ok: true, aviso: "Sem e-mail no payload" });
    }

    const usuaria = await buscarUsuarioPorEmail(supabase, email);
    if (!usuaria) {
      console.warn(`Webhook Kiwify: cancelamento pra ${email}, mas não achei a usuária no Supabase.`);
      return NextResponse.json({ ok: true, aviso: "Usuária não encontrada" });
    }

    await supabase.from("profiles").update({ plano: "gratuito" }).eq("id", usuaria.id);
    await supabase
      .from("assinaturas")
      .update({ status: "cancelada" })
      .eq("user_id", usuaria.id)
      .eq("provedor", "kiwify");

    console.log(`❌ Acesso removido de ${email} (user_id ${usuaria.id}) por cancelamento/reembolso.`);
    return NextResponse.json({ ok: true });
  }

  // Outros eventos (boleto gerado, PIX gerado, carrinho abandonado, etc.)
  // não exigem nenhuma ação aqui — só confirmamos o recebimento.
  return NextResponse.json({ ok: true, ignorado: true });
}
