import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/webhooks/asaas
 * Webhook para receber notificações de mudanças de status de assinaturas do Asaas.
 * Atualiza o status do usuário no banco de dados quando a assinatura é ativada ou cancelada.
 */
export async function POST(request: Request) {
    const body = await request.json();
    const supabase = createClient();

    // Validar token webhook
    const authHeader = request.headers.get("asaas-webhook-token");
    const webhookToken = process.env.ASAAS_WEBHOOK_TOKEN;

    if (!authHeader || authHeader !== webhookToken) {
          return NextResponse.json(
                  { erro: "Token de webhook inválido" },
                  { status: 401 }
                );
        }

    try {
          const event = body.event;
          const data = body.data;

          // Processar eventos de mudança de status de assinatura
          if (event === "subscription.status_changed") {
                  const subscriptionId = data.id;
                  const status = data.status; // active, inactive, expired, cancelled

                  // Buscar usuário pela subscription ID
                  const { data: userData, error: userError } = await supabase
                    .from("usuarios_asaas")
                    .select("user_id")
                    .eq("asaas_subscription_id", subscriptionId)
                    .single();

                  if (userError || !userData) {
                            console.warn(
                                        `Nenhum usuário encontrado para subscription ${subscriptionId}`
                                      );
                            return NextResponse.json({
                                        ok: true,
                                        warning: "Subscription não encontrada",
                                      });
                          }

                  if (status === "active") {
                            // Ativar acesso do usuário
                            const { error: updateError } = await supabase
                              .from("usuarios_asaas")
                              .update({
                                            status: "ativo",
                                            data_ativacao: new Date().toISOString(),
                                          })
                              .eq("user_id", userData.user_id);

                            if (updateError) {
                                        console.error(
                                                      `Erro ao ativar usuário ${userData.user_id}:`,
                                                      updateError
                                                    );
                                        return NextResponse.json(
                                                      { erro: "Erro ao ativar assinatura" },
                                                      { status: 500 }
                                                    );
                                      }

                            console.log(`✅ Usuário ${userData.user_id} ativado com sucesso!`);
                          } else if (status === "cancelled" || status === "inactive") {
                            // Desativar acesso do usuário
                            const { error: updateError } = await supabase
                              .from("usuarios_asaas")
                              .update({ status: "inativo" })
                              .eq("user_id", userData.user_id);

                            if (updateError) {
                                        console.error(
                                                      `Erro ao desativar usuário ${userData.user_id}:`,
                                                      updateError
                                                    );
                                        return NextResponse.json(
                                                      { erro: "Erro ao desativar assinatura" },
                                                      { status: 500 }
                                                    );
                                      }

                            console.log(`❌ Usuário ${userData.user_id} desativado.`);
                          }
                }

          return NextResponse.json({ ok: true });
        } catch (error: any) {
          console.error("Erro no webhook Asaas:", error.message || error);
          return NextResponse.json(
                  { erro: "Erro ao processar webhook", detalhes: error.message },
                  { status: 500 }
                );
        }
  }
