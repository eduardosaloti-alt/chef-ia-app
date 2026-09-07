"use client";

import { useMemo, useState } from "react";
import { useChefIA } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { clsx } from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

function diasDoMes(ano: number, mes: number) {
  const totalDias = new Date(ano, mes + 1, 0).getDate();
  const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
  return { totalDias, primeiroDiaSemana };
}

export default function AgendaPage() {
  const { pedidos, clientes } = useChefIA();
  const hoje = new Date();
  const [mesAtual, setMesAtual] = useState(hoje.getMonth());
  const [anoAtual, setAnoAtual] = useState(hoje.getFullYear());
  const [diaSelecionado, setDiaSelecionado] = useState<number | null>(hoje.getDate());

  const estaNoMesAtual = mesAtual === hoje.getMonth() && anoAtual === hoje.getFullYear();

  function irParaMesAnterior() {
    setDiaSelecionado(null);
    if (mesAtual === 0) {
      setMesAtual(11);
      setAnoAtual((a) => a - 1);
    } else {
      setMesAtual((m) => m - 1);
    }
  }

  function irParaProximoMes() {
    setDiaSelecionado(null);
    if (mesAtual === 11) {
      setMesAtual(0);
      setAnoAtual((a) => a + 1);
    } else {
      setMesAtual((m) => m + 1);
    }
  }

  function irParaHoje() {
    setMesAtual(hoje.getMonth());
    setAnoAtual(hoje.getFullYear());
    setDiaSelecionado(hoje.getDate());
  }

  const { totalDias, primeiroDiaSemana } = diasDoMes(anoAtual, mesAtual);

  const pedidosPorDia = useMemo(() => {
    const mapa: Record<number, typeof pedidos> = {};
    pedidos.forEach((p) => {
      // Parse manual do "YYYY-MM-DD" (sem passar por Date com fuso UTC),
      // pra não voltar um dia quando o fuso local é negativo (ex: Brasil).
      const [ano, mes, dia] = p.dataEntrega.slice(0, 10).split("-").map(Number);
      if (mes - 1 === mesAtual && ano === anoAtual) {
        mapa[dia] = [...(mapa[dia] ?? []), p];
      }
    });
    return mapa;
  }, [pedidos, mesAtual, anoAtual]);

  const nomeMes = new Date(anoAtual, mesAtual).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  const pedidosDoDia = diaSelecionado ? pedidosPorDia[diaSelecionado] ?? [] : [];

  return (
    <div className="animate-fade-up">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Agenda</h1>
          <p className="mt-1 capitalize text-cacau/60 dark:text-cream/60">{nomeMes}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={irParaMesAnterior}
            aria-label="Mês anterior"
            className="rounded-full p-2 text-cacau/60 hover:bg-cream-soft hover:text-framboesa dark:text-cream/60 dark:hover:bg-cacau-soft"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          {!estaNoMesAtual && (
            <button
              onClick={irParaHoje}
              className="rounded-full border border-cacau/15 px-3 py-1.5 text-xs text-cacau/70 hover:bg-cream-soft dark:border-cream/15 dark:text-cream/70 dark:hover:bg-cacau-soft"
            >
              Hoje
            </button>
          )}
          <button
            onClick={irParaProximoMes}
            aria-label="Próximo mês"
            className="rounded-full p-2 text-cacau/60 hover:bg-cream-soft hover:text-framboesa dark:text-cream/60 dark:hover:bg-cacau-soft"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <Card>
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-cacau/40 dark:text-cream/40">
            {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => (
              <div key={i} className="py-2">{d}</div>
            ))}
            {Array.from({ length: primeiroDiaSemana }).map((_, i) => (
              <div key={`vazio-${i}`} />
            ))}
            {Array.from({ length: totalDias }).map((_, i) => {
              const dia = i + 1;
              const temPedido = pedidosPorDia[dia]?.length > 0;
              return (
                <button
                  key={dia}
                  onClick={() => setDiaSelecionado(dia)}
                  className={clsx(
                    "aspect-square rounded-xl text-sm transition-colors",
                    diaSelecionado === dia
                      ? "bg-framboesa text-cream"
                      : "hover:bg-cream-soft dark:hover:bg-cacau-soft"
                  )}
                >
                  <span className="relative">
                    {dia}
                    {temPedido && (
                      <span
                        className={clsx(
                          "absolute -bottom-2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full",
                          diaSelecionado === dia ? "bg-cream" : "bg-framboesa"
                        )}
                      />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 font-display text-lg">
            {diaSelecionado ? `Dia ${diaSelecionado}` : "Selecione um dia"}
          </h2>
          {pedidosDoDia.length === 0 && (
            <p className="text-sm text-cacau/50 dark:text-cream/50">Nenhuma entrega neste dia.</p>
          )}
          <div className="flex flex-col gap-3">
            {pedidosDoDia.map((p) => {
              const cliente = clientes.find((c) => c.id === p.clienteId);
              return (
                <div key={p.id} className="rounded-xl bg-cream-soft p-3 dark:bg-cacau-soft">
                  <p className="text-sm font-medium">{p.produtoDescricao}</p>
                  <p className="text-xs text-cacau/50 dark:text-cream/50">{cliente?.nome} · R$ {p.valor.toFixed(2)}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
