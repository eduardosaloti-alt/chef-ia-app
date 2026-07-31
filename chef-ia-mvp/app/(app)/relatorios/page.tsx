"use client";

import { useChefIA } from "@/lib/store";
import { Card } from "@/components/ui/card";

function formatarReal(valor: number) {
  if (!isFinite(valor)) return "R$ 0,00";
    return "R$ " + valor.toFixed(2).replace(".", ",");
    }

    function mesLabel(mesAno: string) {
      const [ano, mes] = mesAno.split("-");
        const nomes = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
          return nomes[Number(mes) - 1] + "/" + ano;
          }

          export default function RelatoriosPage() {
            const { profile, transacoes, produtos } = useChefIA();

              const porMes: Record<string, { entradas: number; saidas: number }> = {};
                transacoes.forEach((t) => {
                    const mesAno = t.data.slice(0, 7);
                        if (!porMes[mesAno]) porMes[mesAno] = { entradas: 0, saidas: 0 };
                            if (t.tipo === "entrada") porMes[mesAno].entradas += t.valor;
                                else porMes[mesAno].saidas += t.valor;
                                  });
                                    const mesesOrdenados = Object.keys(porMes).sort().reverse();

                                      if (profile.plano !== "premium") {
                                          return (
                                          <div className="animate-fade-up max-w-2xl">
                                          <header className="mb-8">
                                          <h1 className="font-display text-3xl">Relatórios</h1>
                                          <p className="mt-1 text-cacau/60 dark:text-cream/60">Recurso exclusivo do plano PRO.</p>
                                          </header>
                                          <Card className="py-10 text-center">
                                          <p className="text-sm text-cacau/60 dark:text-cream/60">
                                          Faça upgrade para o plano PRO para liberar os relatórios de lucratividade.
                                          </p>
                                          </Card>
                                          </div>
                                          );
                                            }

                                              return (
                                              <div className="animate-fade-up max-w-2xl">
                                              <header className="mb-8">
                                              <h1 className="font-display text-3xl">Relatórios</h1>
                                              <p className="mt-1 text-cacau/60 dark:text-cream/60">
                                              Lucratividade mensal e por produto, com base no seu fluxo de caixa e na sua precificação.
                                              </p>
                                              </header>

                                              <h2 className="mb-3 font-display text-xl">Lucratividade mensal</h2>
                                              {mesesOrdenados.length === 0 ? (
                                              <Card className="mb-8 py-8 text-center">
                                              <p className="text-sm text-cacau/60 dark:text-cream/60">
                                              Ainda não há transações lançadas no Fluxo de caixa para calcular a lucratividade mensal.
                                              </p>
                                              </Card>
                                              ) : (
                                              <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                              {mesesOrdenados.map((mesAno) => {
                                              const { entradas, saidas } = porMes[mesAno];
                                              const lucro = entradas - saidas;
                                              return (
                                              <Card key={mesAno}>
                                              <div className="font-medium">{mesLabel(mesAno)}</div>
                                              <div className="mt-1 text-sm text-cacau/60 dark:text-cream/60">Entradas: {formatarReal(entradas)}</div>
                                              <div className="text-sm text-cacau/60 dark:text-cream/60">Saídas: {formatarReal(saidas)}</div>
                                              <div className={"mt-1 font-medium " + (lucro >= 0 ? "text-green-600" : "text-framboesa")}>
                                              Lucro: {formatarReal(lucro)}
                                              </div>
                                              </Card>
                                              );
                                              })}
                                              </div>
                                              )}

                                              <h2 className="mb-3 font-display text-xl">Lucratividade por produto</h2>
                                              {produtos.length === 0 ? (
                                              <Card className="py-8 text-center">
                                              <p className="text-sm text-cacau/60 dark:text-cream/60">
                                              Cadastre produtos na Precificação para ver a lucratividade estimada de cada um aqui.
                                              </p>
                                              </Card>
                                              ) : (
                                              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                              {produtos.map((p) => {
                                              const custoTotal = (p.custoIngredientes ?? 0) + (p.custoMaoDeObra ?? 0) + (p.custoFixoRateado ?? 0);
                                              const lucroUnitario = (p.precoSugerido ?? 0) - custoTotal;
                                              return (
                                              <Card key={p.id}>
                                              <div className="font-medium">{p.nome}</div>
                                              <div className="mt-1 text-sm text-cacau/60 dark:text-cream/60">Custo estimado: {formatarReal(custoTotal)}</div>
                                              <div className="text-sm text-cacau/60 dark:text-cream/60">Preço sugerido: {formatarReal(p.precoSugerido ?? 0)}</div>
                                              <div className={"mt-1 font-medium " + (lucroUnitario >= 0 ? "text-green-600" : "text-framboesa")}>
                                              Lucro por unidade: {formatarReal(lucroUnitario)}
                                              </div>
                                              </Card>
                                              );
                                              })}
                                              </div>
                                              )}
                                              </div>
                                              );
                                              }
                                              
