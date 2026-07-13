import axios from "axios";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/checkout
 * Cria uma assinatura no Asaas para a Chef IA (preço único
 * de R$29,90/mês, com 15 dias de trial grátis) e retorna a URL de pagamento.
 *
 * Promoção "Fundadora": enquanto restarem vagas das 100 primeiras
 * (contar_fundadores() < 100), aplicamos automaticamente um desconto
 * (configurável em ASAAS_DISCOUNT_FOUNDER) para as primeiras clientes.
 */
export async function POST(request: Request) {
      const supabase = createClient();
      const {
              data: { user },
      } = await supabase.auth.getUser();

  if (!user) {
          return NextResponse.json(
              { erro: "Você precisa estar logada para assinar." },
              { status: 401 }
                  );
  }

  try {
          const vagas = (await supabase.rpc("contar_fundadores"))?.data ?? 0;
          const aindaHaVagas = vagas < 100;
          const desconto = aindaHaVagas
            ? parseInt(process.env.ASAAS_DISCOUNT_FOUNDER || "10")
                    : 0;
          const precoBase = parseFloat(process.env.ASAAS_PRICE_MONTHLY || "29.90");
          const precoComDesconto = precoBase - desconto;

        // Criar cliente no Asaas
        const clientResponse = await axios.post(
                  "https://api.asaas.com/v3/customers",
            {
                        name:
                                      user.user_metadata?.name ||
                                      user.email?.split("@")[0] ||
                                      "Cliente",
                        email: user.email,
                        mobilePhone: user.user_metadata?.phone || null,
            },
            {
                        headers: {
                                      access_token: process.env.ASAAS_SECRET_KEY,
                                      "Content-Type": "application/json",
                        },
            }
                );

        const customerId = clientResponse.data.id;

        // Calcular data do próximo vencimento (15 dias de trial)
        const nextDueDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0];

        // Criar assinatura (recorrência) no Asaas
        const subscriptionResponse = await axios.post(
                  "https://api.asaas.com/v3/subscriptions",
            {
                        customerId,
                        billingType: "CREDIT_CARD",
                        value: precoComDesconto,
                        nextDueDate,
                        cycle: "MONTHLY",
                        description: `Assinatura Chef IA${aindaHaVagas ? " - Plano Fundadora" : ""}`,
                        maxAttempts: 3,
            },
            {
                        headers: {
                                      access_token: process.env.ASAAS_SECRET_KEY,
                                      "Content-Type": "application/json",
                        },
            }
                );

        const subscriptionId = subscriptionResponse.data.id;

        // Salvar informações no banco de dados
        await supabase.from("usuarios_asaas").insert({
                  user_id: user.id,
                  asaas_customer_id: customerId,
                  asaas_subscription_id: subscriptionId,
                  plano: aindaHaVagas ? "fundador" : "pro",
                  status: "aguardando_pagamento",
                  data_criacao: new Date(),
        });

        // Gerar link de pagamento do Asaas
        const paymentLink = `https://www.asaas.com/checkout/${subscriptionId}`;

        return NextResponse.json({ url: paymentLink });
  } catch (error: any) {
          console.error("Erro ao criar assinatura Asaas:", error.response?.data || error.message);
          return NextResponse.json(
              {
                          erro:
                                        error.response?.data?.errors?.[0]?.detail ||
                                        "Erro ao processar pagamento. Tente novamente.",
              },
              { status: 500 }
                  );
  }
}
