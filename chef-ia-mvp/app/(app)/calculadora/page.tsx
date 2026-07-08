"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { calcularPreco, type ResultadoPrecificacao } from "@/lib/ai/precificacao";
import { PipingDivider } from "@/components/ui/piping-divider";

export default function CalculadoraPage() {
  const [custoIngredientes, setCustoIngredientes] = useState("45");
  const [horasTrabalho, setHorasTrabalho] = useState("2");
  const [valorHora, setValorHora] = useState("25");
  const [custoFixoMensal, setCustoFixoMensal] = useState("600");
  const [quantidadeProduzidaMes, setQuantidadeProduzidaMes] = useState("20");
  const [margemDesejada, setMargemDesejada] = useState("40");
  const [resultado, setResultado] = useState<ResultadoPrecificacao | null>(null);

  function calcular() {
    setResultado(
      calcularPreco({
        custoIngredientes: parseFloat(custoIngredientes) || 0,
        horasTrabalho: parseFloat(horasTrabalho) || 0,
        valorHora: parseFloat(valorHora) || 0,
        custoFixoMensal: parseFloat(custoFixoMensal) || 0,
        quantidadeProduzidaMes: parseFloat(quantidadeProduzidaMes) || 1,
        margemDesejada: parseFloat(margemDesejada) || 0,
      })
    );
  }

  return (
    <div className="animate-fade-up">
      <header className="mb-8">
        <h1 className="font-display text-3xl">Calculadora inteligente de precificação</h1>
        <p className="mt-1 text-cacau/60 dark:text-cream/60">
          Descubra o preço ideal considerando ingredientes, seu tempo e os custos fixos do seu negócio.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-4">
            <Label htmlFor="ingredientes">Custo dos ingredientes (R$)</Label>
            <Input id="ingredientes" type="number" value={custoIngredientes} onChange={(e) => setCustoIngredientes(e.target.value)} />
          </div>
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="horas">Horas de trabalho</Label>
              <Input id="horas" type="number" value={horasTrabalho} onChange={(e) => setHorasTrabalho(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="valorhora">Valor da sua hora (R$)</Label>
              <Input id="valorhora" type="number" value={valorHora} onChange={(e) => setValorHora(e.target.value)} />
            </div>
          </div>
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="fixo">Custo fixo mensal (R$)</Label>
              <Input id="fixo" type="number" value={custoFixoMensal} onChange={(e) => setCustoFixoMensal(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="qtd">Produção mensal (unidades)</Label>
              <Input id="qtd" type="number" value={quantidadeProduzidaMes} onChange={(e) => setQuantidadeProduzidaMes(e.target.value)} />
            </div>
          </div>
          <div className="mb-6">
            <Label htmlFor="margem">Margem de lucro desejada (%)</Label>
            <Input id="margem" type="number" value={margemDesejada} onChange={(e) => setMargemDesejada(e.target.value)} />
          </div>
          <Button onClick={calcular} className="w-full">Calcular preço ideal</Button>
        </Card>

        <Card className="flex flex-col items-center justify-center text-center">
          {resultado ? (
            <>
              <p className="text-xs uppercase tracking-wide text-cacau/50 dark:text-cream/50">Preço sugerido</p>
              <p className="my-3 font-display text-5xl text-framboesa">
                R$ {resultado.precoSugerido.toFixed(2)}
              </p>
              <PipingDivider className="mb-4 h-3 w-16 text-dourado" />
              <p className="max-w-sm text-sm text-cacau/70 dark:text-cream/70">{resultado.explicacao}</p>
            </>
          ) : (
            <p className="text-sm text-cacau/50 dark:text-cream/50">
              Preencha os campos ao lado e clique em calcular para ver o preço ideal.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
