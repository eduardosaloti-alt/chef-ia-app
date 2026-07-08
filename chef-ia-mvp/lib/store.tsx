"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { Cliente, Pedido, Produto, Profile, Transacao } from "@/types";

/**
 * Este store mantém o estado do app em memória, no navegador.
 * É um substituto temporário para o Supabase — a MESMA interface
 * (métodos add/update/remove) deve ser reimplementada em
 * `lib/supabase/queries.ts` quando o backend real for conectado,
 * sem precisar alterar nenhuma tela.
 */

interface ChefIAState {
  profile: Profile;
  clientes: Cliente[];
  pedidos: Pedido[];
  produtos: Produto[];
  transacoes: Transacao[];
  addCliente: (c: Omit<Cliente, "id">) => void;
  addPedido: (p: Omit<Pedido, "id">) => void;
  updatePedidoStatus: (id: string, status: Pedido["status"]) => void;
  addTransacao: (t: Omit<Transacao, "id">) => void;
}

const ChefIAContext = createContext<ChefIAState | null>(null);

const seedClientes: Cliente[] = [
  { id: "c1", nome: "Marina Alves", whatsapp: "(11) 98888-1234", aniversario: "1990-03-12" },
  { id: "c2", nome: "Fernanda Costa", whatsapp: "(11) 97777-5678", aniversario: "1988-11-02" },
  { id: "c3", nome: "Juliana Prado", whatsapp: "(11) 96666-9012" },
];

const seedPedidos: Pedido[] = [
  { id: "p1", clienteId: "c1", produtoDescricao: "Bolo de 2 andares — chocolate belga", valor: 380, dataEntrega: "2026-07-12", status: "producao" },
  { id: "p2", clienteId: "c2", produtoDescricao: "50 brigadeiros gourmet", valor: 150, dataEntrega: "2026-07-10", status: "novo" },
  { id: "p3", clienteId: "c3", produtoDescricao: "Cento de brownies", valor: 220, dataEntrega: "2026-07-09", status: "entregue" },
];

const seedProdutos: Produto[] = [
  { id: "pr1", nome: "Bolo de chocolate (2kg)", categoria: "Bolo", custoIngredientes: 45, custoMaoDeObra: 60, custoFixoRateado: 12, margemDesejada: 40, precoSugerido: 165 },
];

const seedTransacoes: Transacao[] = [
  { id: "t1", tipo: "entrada", categoria: "Venda", descricao: "Cento de brownies — Juliana", valor: 220, data: "2026-07-09" },
  { id: "t2", tipo: "saida", categoria: "Insumos", descricao: "Compra de chocolate e farinha", valor: 130, data: "2026-07-08" },
];

export function ChefIAProvider({ children }: { children: React.ReactNode }) {
  const [profile] = useState<Profile>({
    id: "u1",
    nome: "Ana",
    nomeNegocio: "Doces da Ana",
    plano: "fundador",
    precoTravado: 19.9,
    fundador: true,
  });
  const [clientes, setClientes] = useState<Cliente[]>(seedClientes);
  const [pedidos, setPedidos] = useState<Pedido[]>(seedPedidos);
  const [produtos] = useState<Produto[]>(seedProdutos);
  const [transacoes, setTransacoes] = useState<Transacao[]>(seedTransacoes);

  const addCliente = (c: Omit<Cliente, "id">) =>
    setClientes((prev) => [...prev, { ...c, id: crypto.randomUUID() }]);

  const addPedido = (p: Omit<Pedido, "id">) =>
    setPedidos((prev) => [...prev, { ...p, id: crypto.randomUUID() }]);

  const updatePedidoStatus = (id: string, status: Pedido["status"]) =>
    setPedidos((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));

  const addTransacao = (t: Omit<Transacao, "id">) =>
    setTransacoes((prev) => [...prev, { ...t, id: crypto.randomUUID() }]);

  const value = useMemo(
    () => ({ profile, clientes, pedidos, produtos, transacoes, addCliente, addPedido, updatePedidoStatus, addTransacao }),
    [profile, clientes, pedidos, produtos, transacoes]
  );

  return <ChefIAContext.Provider value={value}>{children}</ChefIAContext.Provider>;
}

export function useChefIA() {
  const ctx = useContext(ChefIAContext);
  if (!ctx) throw new Error("useChefIA precisa estar dentro de <ChefIAProvider>");
  return ctx;
}
