"use client";

import { useState } from "react";
import { useChefIA } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Label } from "@/components/ui/input";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { TipoTransacao } from "@/types";

export default function CaixaPage() {
  const { transacoes, addTransacao, updateTransacao, deleteTransacao } = useChefIA();
  const [aberto, setAberto] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [tipo, setTipo] = useState<TipoTransacao>("entrada");
  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState("2026-07-08");

  const entradas = transacoes.filter((t) => t.tipo === "entrada").reduce((acc, t) => acc + t.valor, 0);
  const saidas = transacoes.filter((t) => t.tipo === "saida").reduce((acc, t) => acc + t.valor, 0);
  const saldo = entradas - saidas;

  const ordenadas = [...transacoes].sort((a, b) => a.data.localeCompare(b.data));
  let acumulado = 0;
  const dadosGrafico = ordenadas.map((t) => {
    acumulado += t.tipo === "entrada" ? t.valor : -t.valor;
    return {
      data: new Date(t.data).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      saldo: acumulado,
    };
  });

  function abrirNovo() {
    setEditandoId(null);
    setTipo("entrada");
    setCategoria("");
    setDescricao("");
    setValor("");
    setData("2026-07-08");
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
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Fluxo de caixa</h1>
          <p className="mt-1 text-cacau/60 dark:text-cream/60">
            Saldo atual: R$ <span className="font-mono font-medium">{saldo.toFixed(2)}</span>
          </p>
        </div>
        <div>
          <Button onClick={() => (aberto ? setAberto(false) : abrirNovo())}>
            {aberto ? "Cancelar" : "Novo lançamento"}
          </Button>
        </div>
      </header>

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

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <div className="text-xs text-cacau/50 dark:text-cream/50">Entradas</div>
          <div className="mt-2 font-mono text-xl text-pistache">R$ {entradas.toFixed(2)}</div>
        </Card>
        <Card>
          <div className="text-xs text-cacau/50 dark:text-cream/50">Saídas</div>
          <div className="mt-2 font-mono text-xl text-framboesa">R$ {saidas.toFixed(2)}</div>
        </Card>
        <Card>
          <div className="text-xs text-cacau/50 dark:text-cream/50">Saldo</div>
          <div className="mt-2 font-mono text-xl">R$ {saldo.toFixed(2)}</div>
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
        <div className="flex flex-col divide-y divide-cacau/10 dark:divide-cream/10">
          {[...transacoes].reverse().map((t) => (
            <div key={t.id} className="flex items-center justify-between py-3">
              <div>
                <div className="text-sm font-medium">{t.descricao}</div>
                <div className="text-xs text-cacau/50 dark:text-cream/50">
                  {t.categoria} · {new Date(t.data).toLocaleDateString("pt-BR")}
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
"use client";

import { useState } from "react";
import { useChefIA } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Label } from "@/components/ui/input";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { TipoTransacao } from "@/types";

export default function CaixaPage() {
  const { transacoes, addTransacao } = useChefIA();
  const [aberto, setAberto] = useState(false);
  const [tipo, setTipo] = useState<TipoTransacao>("entrada");
  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState("2026-07-08");

  const entradas = transacoes.filter((t) => t.tipo === "entrada").reduce((a, t) => a + t.valor, 0);
  const saidas = transacoes.filter((t) => t.tipo === "saida").reduce((a, t) => a + t.valor, 0);
  const saldo = entradas - saidas;

  const ordenadas = [...transacoes].sort((a, b) => a.data.localeCompare(b.data));
  let acumulado = 0;
  const dadosGrafico = ordenadas.map((t) => {
    acumulado += t.tipo === "entrada" ? t.valor : -t.valor;
    return { data: new Date(t.data).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }), saldo: acumulado };
  });

  function salvar() {
    if (!descricao.trim() || !valor) return;
    addTransacao({ tipo, categoria: categoria || "Geral", descricao, valor: parseFloat(valor), data });
    setDescricao("");
    setValor("");
    setCategoria("");
    setAberto(false);
  }

  return (
    <div className="animate-fade-up">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Fluxo de caixa</h1>
          <p className="mt-1 text-cacau/60 dark:text-cream/60">Saldo atual: <span className="font-mono font-medium">R$ {saldo.toFixed(2)}</span></p>
        </div>
        <Button onClick={() => setAberto((v) => !v)}>{aberto ? "Cancelar" : "Novo lançamento"}</Button>
      </header>

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
            <Input id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Ex: Compra de farinha" />
          </div>
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="categoria">Categoria</Label>
              <Input id="categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)} placeholder="Insumos, Venda..." />
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
          <Button onClick={salvar}>Salvar lançamento</Button>
        </Card>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-xs text-cacau/50 dark:text-cream/50">Entradas</p>
          <p className="mt-2 font-mono text-xl text-pistache">R$ {entradas.toFixed(2)}</p>
        </Card>
        <Card>
          <p className="text-xs text-cacau/50 dark:text-cream/50">Saídas</p>
          <p className="mt-2 font-mono text-xl text-framboesa">R$ {saidas.toFixed(2)}</p>
        </Card>
        <Card>
          <p className="text-xs text-cacau/50 dark:text-cream/50">Saldo</p>
          <p className="mt-2 font-mono text-xl">R$ {saldo.toFixed(2)}</p>
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
        <div className="flex flex-col divide-y divide-cacau/10 dark:divide-cream/10">
          {[...transacoes].reverse().map((t) => (
            <div key={t.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium">{t.descricao}</p>
                <p className="text-xs text-cacau/50 dark:text-cream/50">
                  {t.categoria} · {new Date(t.data).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`font-mono text-sm ${t.tipo === "entrada" ? "text-pistache" : "text-framboesa"}`}>
                  {t.tipo === "entrada" ? "+" : "-"} R$ {t.valor.toFixed(2)}
                </span>
                <Badge tone={t.tipo === "entrada" ? "pistache" : "framboesa"}>{t.tipo === "entrada" ? "Entrada" : "Saída"}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
