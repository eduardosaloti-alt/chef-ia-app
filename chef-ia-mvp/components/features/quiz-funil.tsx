"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const perguntas = [
  {
    pergunta: "Qual dessas frases combina mais com voce hoje?",
    opcoes: [
      "Ainda nao vendo, mas quero comecar",
      "Vendo por encomenda pra amigos e familia",
      "Ja tenho clientes fixos, mas sem organizacao",
      "Tenho um fluxo grande de pedidos e preciso profissionalizar",
    ],
  },
  {
    pergunta: "Qual e o seu maior desafio na confeitaria hoje?",
    opcoes: [
      "Nao sei quanto cobrar pelos meus doces",
      "Perco prazos porque nao tenho agenda organizada",
      "Nao sei se estou tendo lucro de verdade no fim do mes",
      "Uso papel ou planilha e ja nao da mais conta",
    ],
  },
  {
    pergunta: "Com que frequencia voce vende doces?",
    opcoes: [
      "So em datas especiais",
      "Toda semana",
      "Quase todos os dias",
      "E meu negocio principal, em tempo integral",
    ],
  },
  {
    pergunta: "Uma calculadora que mostra o preco certo de cada doce em segundos mudaria seu negocio?",
    opcoes: ["Sim, com certeza", "Ajudaria bastante", "Talvez ajude um pouco"],
  },
  {
    pergunta: "Quanto tempo por semana voce perde organizando pedidos, precos e contas manualmente?",
    opcoes: ["Menos de 1 hora", "De 1 a 3 horas", "Mais de 3 horas", "Nem sei dizer, e uma bagunca"],
  },
];

export function QuizFunil() {
  const [passo, setPasso] = useState(0);
  const [respostas, setRespostas] = useState<string[]>([]);

  const total = perguntas.length;
  const finalizado = passo >= total;
  const progresso = Math.round((Math.min(passo, total) / total) * 100);

  function escolher(opcao: string) {
    const novas = [...respostas.slice(0, passo), opcao];
    setRespostas(novas);
    setPasso(passo + 1);
  }

  function voltar() {
    if (passo > 0) setPasso(passo - 1);
  }

  const desafio = respostas[1];
  const progressoStyle = { width: progresso + "%" };
  const resultadoTexto = desafio
    ? 'Voce disse que o maior desafio e: "' + desafio + '". '
    : "";

  return (
    <div className="mx-auto max-w-xl px-6 py-12">
      {!finalizado && (
        <div className="mb-8">
          <div className="h-2 w-full overflow-hidden rounded-full bg-cacau/10 dark:bg-cream/10">
            <div
              className="h-full rounded-full bg-framboesa transition-all duration-300"
              style={progressoStyle}
            />
          </div>
          <p className="mt-2 text-xs text-cacau/50 dark:text-cream/50">
            Pergunta {passo + 1} de {total}
          </p>
        </div>
      )}

      {!finalizado && (
        <Card>
          <h2 className="mb-6 font-display text-2xl">{perguntas[passo].pergunta}</h2>
          <div className="flex flex-col gap-3">
            {perguntas[passo].opcoes.map((opcao) => (
              <button
                key={opcao}
                onClick={() => escolher(opcao)}
                className="rounded-2xl border border-cacau/10 bg-white/60 px-4 py-3 text-left text-sm transition-all duration-150 hover:border-framboesa hover:bg-framboesa/5 dark:border-cream/10 dark:bg-cacau-soft/40 dark:hover:bg-framboesa/10"
              >
                {opcao}
              </button>
            ))}
          </div>
          {passo > 0 && (
            <button onClick={voltar} className="mt-6 text-xs text-cacau/50 hover:underline dark:text-cream/50">
              Voltar
            </button>
          )}
        </Card>
      )}

      {finalizado && (
        <Card className="text-center">
          <Badge tone="dourado" className="mb-4">Seu resultado</Badge>
          <h2 className="mb-3 font-display text-2xl">
            O Chef IA foi feito pra resolver exatamente isso
          </h2>
          <p className="mb-6 text-sm text-cacau/70 dark:text-cream/70">
            {resultadoTexto}
            Com o Chef IA voce precifica certo, organiza seus pedidos e sua agenda, e enxerga o fluxo de caixa real do seu negocio, tudo em um so lugar.
          </p>
          <Link href="/cadastro">
            <Button className="w-full">Testar gratis por 15 dias</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
