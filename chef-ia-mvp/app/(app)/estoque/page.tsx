"use client";

import { useChefIA } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Package } from "lucide-react";

export default function EstoquePage() {
  const { profile } = useChefIA();

    if (profile.plano !== "premium") {
        return (
              <div className="animate-fade-up max-w-2xl">
                      <header className="mb-8">
                                <h1 className="font-display text-3xl">Controle de estoque</h1>
                                          <p className="mt-1 text-cacau/60 dark:text-cream/60">Recurso exclusivo do plano PRO.</p>
                                                  </header>
                                                          <Card className="py-10 text-center">
                                                                    <p className="text-sm text-cacau/60 dark:text-cream/60">
                                                                                Faça upgrade para o plano PRO para liberar o controle de estoque.
                                                                                          </p>
                                                                                                  </Card>
                                                                                                        </div>
                                                                                                            );
                                                                                                              }
                                                                                                              
                                                                                                                return (
                                                                                                                    <div className="animate-fade-up max-w-2xl">
                                                                                                                          <header className="mb-8">
                                                                                                                                  <h1 className="font-display text-3xl">Controle de estoque</h1>
                                                                                                                                          <p className="mt-1 text-cacau/60 dark:text-cream/60">
                                                                                                                                                    Cadastre seus insumos e acompanhe o que você tem em casa.
                                                                                                                                                            </p>
                                                                                                                                                                  </header>
                                                                                                                                                                  
                                                                                                                                                                        <Card className="flex flex-col items-center gap-3 py-12 text-center">
                                                                                                                                                                                <Package size={32} className="text-framboesa" />
                                                                                                                                                                                        <p className="font-display text-xl">Em construção</p>
                                                                                                                                                                                                <p className="max-w-sm text-sm text-cacau/60 dark:text-cream/60">
                                                                                                                                                                                                          Essa tela ainda está sendo preparada. Em breve você vai poder cadastrar seus insumos, quantidades e receber alertas de estoque baixo por aqui.
                                                                                                                                                                                                                  </p>
                                                                                                                                                                                                                        </Card>
                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                              );
                                                                                                                                                                                                                              }
