"use client";

import { useState } from "react";
import { useChefIA } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Label } from "@/components/ui/input";
import type { StatusPedido } from "@/types";

const statusOptions: { value: StatusPedido; label: string; tone: "framboesa" | "dourado" | "pistache" | "neutro" }[] = [
  { value: "novo", label: "Novo", tone: "neutro" },
  { value: "producao", label: "Em produção", tone: "dourado" },
  { value: "entregue", label: "Entregue", tone: "pistache" },
  { value: "pago", label: "Pago", tone: "pistache" },
  { value: "cancelado", label: "Cancelado", tone: "framboesa" },
];

export default function PedidosPage() {
  const { pedidos, clientes, addPedido, updatePedidoStatus } = useChefIA();
  const [aberto, setAberto] = useState(false);
  const [clienteId, setClienteId] = useState(clientes[0]?.id ?? "");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [dataEntrega, setDataEntrega] = useState("");

  function salvar() {
    if (!descricao.trim() || !valor || !dataEntrega || !clienteId) return;
    addPedido({
      clienteId,
      produtoDescricao: descricao,
      valor: parseFloat(valor),
      dataEntrega,
      status: "novo",
    });
    setDescricao("");
    setValor("");
    setDataEntrega("");
    setAberto(false);
  }

  return (
    <div className="animate-fade-up">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Pedidos</h1>
          <p className="mt-1 text-cacau/60 dark:text-cream/60">{pedidos.length} pedidos no total</p>
        </div>
        <Button onClick={() => setAberto((v) => !v)}>{aberto ? "Cancelar" : "Novo pedido"}</Button>
      </header>

      {aberto && (
        <Card className="mb-6 max-w-md">
          <div className="mb-4">
            <Label htmlFor="cliente">Cliente</Label>
            <select
              id="cliente"
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
              className="w-full rounded-xl border border-cacau/15 bg-white px-4 py-2.5 text-sm dark:border-cream/15 dark:bg-cacau-soft"
            >
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <Label htmlFor="descricao">Produto / descrição</Label>
            <Input id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Ex: Bolo de 2 andares" />
          </div>
          <div className="mb-4">
            <Label htmlFor="valor">Valor (R$)</Label>
            <Input id="valor" type="number" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="0,00" />
          </div>
          <div className="mb-4">
            <Label htmlFor="data">Data de entrega</Label>
            <Input id="data" type="date" value={dataEntrega} onChange={(e) => setDataEntrega(e.target.value)} />
          </div>
          <Button onClick={salvar}>Salvar pedido</Button>
        </Card>
      )}

      <Card>
        <div className="flex flex-col divide-y divide-cacau/10 dark:divide-cream/10">
          {pedidos.map((p) => {
            const cliente = clientes.find((c) => c.id === p.clienteId);
            return (
              <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div>
                  <p className="text-sm font-medium">{p.produtoDescricao}</p>
                  <p className="text-xs text-cacau/50 dark:text-cream/50">
                    {cliente?.nome} · Entrega em {new Date(p.dataEntrega).toLocaleDateString("pt-BR")} · R$ {p.valor.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {statusOptions.map((s) => (
                    <button key={s.value} onClick={() => updatePedidoStatus(p.id, s.value)}>
                      <Badge tone={p.status === s.value ? s.tone : "neutro"} className={p.status !== s.value ? "opacity-40 hover:opacity-70" : ""}>
                        {s.label}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
