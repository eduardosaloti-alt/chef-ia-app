"use client";

import { useState } from "react";
import { useChefIA } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Label } from "@/components/ui/input";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { TipoTransacao } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

function formatDateBR(dateStr: string) {
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
}

function hojeISO() {
  const hoje = new Date();
  return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${String(hoje.getDate()).padStart(2, "0")}`;
}

export default function CaixaPage() {
  const { transacoes, addTransacao, updateTransacao, deleteTransacao } = useChefIA();
  const hoje = new Date();
  const [mesAtual, setMesAtual] = useState(hoje.getMonth());
  const [anoAtual, setAnoAtual] = useState(hoje.getFullYear());
  const estaNoMesAtual = mesAtual === hoje.getMonth() && anoAtual === hoje.getFullYear();

  const mesAtualStr = `${anoAtual}-${String(mesAtual + 1).padStart(2, "0")}`;
  const transacoesDoMes = transacoes.filter((t) => t.data.startsWith(mesAtualStr));

  const [aberto, setAberto] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [tipo, setTipo] = useState<TipoTransacao>("entrada");
  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState(hojeISO());

  // Saldo atual: soma de todos os lançamentos já feitos (todos os meses),
  // é o saldo de caixa "de verdade", de hoje — não muda ao navegar entre meses.
  const saldoAtual = transacoes.reduce((acc, t) => acc + (t.tipo === "entrada" ? t.valor : -t.valor), 0);

  // Saldo que já existia antes do mês em exibição (soma de tudo o que
  // aconteceu em meses anteriores), pra mostrar de onde o saldo do mês partiu.
  const saldoAnterior = transacoes
    .filter((t) => t.data < `${mesAtualStr}-01`)
    .reduce((acc, t) => acc + (t.tipo === "entrada" ? t.valor : -t.valor), 0);

  const entradas = transacoesDoMes.filter((t) => t.tipo === "entrada").reduce((acc, t) => acc + t.valor, 0);
  const saidas = transacoesDoMes.filter((t) => t.tipo === "saida").reduce((acc, t) => acc + t.valor, 0);
  const saldoMes = entradas - saidas;
  const saldoFinalMes = saldoAnterior + saldoMes;

  const nomeMes = new Date(anoAtual, mesAtual).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  function irParaMesAnterior() {
    if (mesAtual === 0) {
      setMesAtual(11);
      setAnoAtual((a) => a - 1);
    } else {
      setMesAtual((m) => m - 1);
    }
  }

  function irParaProximoMes() {
    if (mesAtual === 11) {
      setMesAtual(0);
      setAnoAtual((a) => a + 1);
    } else {
      setMesAtual((m) => m + 1);
    }
  }

  function irParaMesAtual() {
    setMesAtual(hoje.getMonth());
    setAnoAtual(hoje.getFullYear());
  }

  const ordenadas = [...transacoesDoMes].sort((a, b) => a.data.localeCompare(b.data));
  let acumulado = saldoAnterior;
  const dadosGrafico = [
    { data: "Início", saldo: saldoAnterior },
    ...ordenadas.map((t) => {
      acumulado += t.tipo === "entrada" ? t.valor : -t.valor;
      return {
        data: formatDateBR(t.data).slice(0, 5),
        saldo: acumulado,
      };
    }),
  ];

  function abrirNovo() {
    setEditandoId(null);
    setTipo("entrada");
    setCategoria("");
    setDescricao("");
    setValor("");
    setData(hojeISO());
    setAberto(true);
  }

  function abrirEdicao(t: { id: string; tipo: TipoTransacao; categoria: string; descricao: string; valor: number; data: string }) {
    setEditandoId(t.id);
    setTipo(t.tipo);
    setCategoria(t.categoria);
    setDescricao(t.descricao);
    setValor(String(t.valor));
    setData(t.data);
    setAberto(true);
  }

  function salvar() {
    if (!descricao.trim() || !valor) return;
    if (editandoId) {
      updateTransacao(editandoId, { tipo, categoria: categoria || "Geral", descricao, valor: parseFloat(valor), data });
    } else {
      addTransacao({ tipo, categoria: categoria || "Geral", descricao, valor: parseFloat(valor), data });
    }
    setDescricao("");
    setValor("");
    setCategoria("");
    setEditandoId(null);
    setAberto(false);
  }

  function excluir(id: string) {
    if (confirm("Tem certeza que deseja excluir este lançamento?")) {
      deleteTransacao(id);
    }
  }

  return (
    <div className="animate-fade-up">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Fluxo de caixa</h1>
          <p className="mt-1 text-cacau/60 dark:text-cream/60">
            Saldo atual: R$ <span className="font-mono font-medium">{saldoAtual.toFixed(2)}</span>
          </p>
        </div>
        <div>
          <Button onClick={() => (aberto ? setAberto(false) : abrirNovo())}>
            {aberto ? "Cancelar" : "Novo lançamento"}
          </Button>
        </div>
      </header>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="capitalize text-cacau/70 dark:text-cream/70">{nomeMes}</p>
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
              onClick={irParaMesAtual}
              className="rounded-full border border-cacau/15 px-3 py-1.5 text-xs text-cacau/70 hover:bg-cream-soft dark:border-cream/15 dark:text-cream/70 dark:hover:bg-cacau-soft"
            >
              Mês atual
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
      </div>

      {aberto && (
        <Card className="mb-6 max-w-md">
          <div className="mb-4 flex gap-2">
            <button
              onClick={() => setTipo("entrada")}
              className={`flex-1 rounded-xl py-2 text-sm ${tipo === "entrada" ? "bg-pistache text-cream" : "bg-cream-soft dark:bg-cacau-soft"}`}
            >
              Entrada
            </button>
            <button
              onClick={() => setTipo("saida")}
              className={`flex-1 rounded-xl py-2 text-sm ${tipo === "saida" ? "bg-framboesa text-cream" : "bg-cream-soft dark:bg-cacau-soft"}`}
            >
              Saída
            </button>
          </div>
          <div className="mb-4">
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Compra de farinha"
            />
          </div>
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="categoria">Categoria</Label>
              <Input
                id="categoria"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                placeholder="Insumos, Venda..."
              />
            </div>
            <div>
              <Label htmlFor="valor">Valor (R$)</Label>
              <Input id="valor" type="number" value={valor} onChange={(e) => setValor(e.target.value)} />
            </div>
          </div>
          <div className="mb-4">
            <Label htmlFor="data">Data</Label>
            <Input id="data" type="date" value={data} onChange={(e) => setData(e.target.value)} />
          </div>
          <Button onClick={salvar}>{editandoId ? "Salvar alterações" : "Salvar lançamento"}</Button>
        </Card>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="text-xs text-cacau/50 dark:text-cream/50">Saldo anterior</div>
          <div className="mt-2 font-mono text-xl">R$ {saldoAnterior.toFixed(2)}</div>
          <p className="mt-1 text-[11px] text-cacau/40 dark:text-cream/40">Trazido dos meses anteriores</p>
        </Card>
        <Card>
          <div className="text-xs text-cacau/50 dark:text-cream/50">Entradas (mês)</div>
          <div className="mt-2 font-mono text-xl text-pistache">R$ {entradas.toFixed(2)}</div>
        </Card>
        <Card>
          <div className="text-xs text-cacau/50 dark:text-cream/50">Saídas (mês)</div>
          <div className="mt-2 font-mono text-xl text-framboesa">R$ {saidas.toFixed(2)}</div>
        </Card>
        <Card>
          <div className="text-xs text-cacau/50 dark:text-cream/50">Saldo final do mês</div>
          <div className="mt-2 font-mono text-xl">R$ {saldoFinalMes.toFixed(2)}</div>
          <p className="mt-1 text-[11px] text-cacau/40 dark:text-cream/40">Anterior + movimentação do mês</p>
        </Card>
      </div>

      <Card className="mb-6 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dadosGrafico}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
            <XAxis dataKey="data" fontSize={12} stroke="currentColor" opacity={0.5} />
            <YAxis fontSize={12} stroke="currentColor" opacity={0.5} />
            <Tooltip />
            <Line type="monotone" dataKey="saldo" stroke="#B23A56" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <h2 className="mb-1 font-display text-lg capitalize">Movimentação · {nomeMes}</h2>
        {transacoesDoMes.length === 0 && (
          <p className="py-3 text-sm text-cacau/50 dark:text-cream/50">Nenhum lançamento neste mês.</p>
        )}
        <div className="flex flex-col divide-y divide-cacau/10 dark:divide-cream/10">
          {[...transacoesDoMes].reverse().map((t) => (
            <div key={t.id} className="flex items-center justify-between py-3">
              <div>
                <div className="text-sm font-medium">{t.descricao}</div>
                <div className="text-xs text-cacau/50 dark:text-cream/50">
                  {t.categoria} · {formatDateBR(t.data)}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`font-mono text-sm ${t.tipo === "entrada" ? "text-pistache" : "text-framboesa"}`}>
                  {t.tipo === "entrada" ? "+" : "-"} R$ {t.valor.toFixed(2)}
                </span>
                <Badge tone={t.tipo === "entrada" ? "pistache" : "framboesa"}>
                  {t.tipo === "entrada" ? "Entrada" : "Saída"}
                </Badge>
                <button
                  onClick={() => abrirEdicao(t)}
                  className="text-xs text-cacau/50 hover:text-framboesa dark:text-cream/50"
                  aria-label="Editar lançamento"
                >
                  Editar
                </button>
                <button
                  onClick={() => excluir(t.id)}
                  className="text-xs text-cacau/50 hover:text-framboesa dark:text-cream/50"
                  aria-label="Excluir lançamento"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
