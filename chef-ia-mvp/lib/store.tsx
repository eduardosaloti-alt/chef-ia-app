"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Cliente, Pedido, Produto, Profile, Transacao } from "@/types";
import {
  getProfile,
  listClientes,
  addCliente as addClienteQuery,
  listPedidos,
  addPedido as addPedidoQuery,
  updatePedidoStatus as updatePedidoStatusQuery,
  listProdutos,
  addProduto as addProdutoQuery,
  updateProduto as updateProdutoQuery,
  deleteProduto as deleteProdutoQuery,
  listTransacoes,
  addTransacao as addTransacaoQuery,
} from "@/lib/supabase/queries";

/**
 * Este store carrega os dados reais do usuário logado a partir do
 * Supabase (lib/supabase/queries.ts). A interface pública (useChefIA)
 * é a mesma de antes, então nenhuma tela precisa mudar.
 */

interface ChefIAState {
  profile: Profile;
  clientes: Cliente[];
  pedidos: Pedido[];
  produtos: Produto[];
  transacoes: Transacao[];
  carregando: boolean;
  addCliente: (c: Omit<Cliente, "id">) => Promise<void>;
  addPedido: (p: Omit<Pedido, "id">) => Promise<void>;
  updatePedidoStatus: (id: string, status: Pedido["status"]) => Promise<void>;
  addProduto: (p: Omit<Produto, "id">) => Promise<void>;
  updateProduto: (id: string, p: Omit<Produto, "id">) => Promise<void>;
  deleteProduto: (id: string) => Promise<void>;
  addTransacao: (t: Omit<Transacao, "id">) => Promise<void>;
}

const ChefIAContext = createContext<ChefIAState | null>(null);

const profilePadrao: Profile = {
  id: "",
  nome: "",
  nomeNegocio: "",
  plano: "gratuito",
  fundador: false,
};

export function ChefIAProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile>(profilePadrao);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;
    async function carregar() {
      try {
        const [perfil, listaClientes, listaPedidos, listaProdutos, listaTransacoes] =
          await Promise.all([
            getProfile(),
            listClientes(),
            listPedidos(),
            listProdutos(),
            listTransacoes(),
          ]);
        if (!ativo) return;
        if (perfil) setProfile(perfil);
        setClientes(listaClientes);
        setPedidos(listaPedidos);
        setProdutos(listaProdutos);
        setTransacoes(listaTransacoes);
      } finally {
        if (ativo) setCarregando(false);
      }
    }
    carregar();
    return () => {
      ativo = false;
    };
  }, []);

  const addCliente = async (c: Omit<Cliente, "id">) => {
    await addClienteQuery(c);
    const atualizados = await listClientes();
    setClientes(atualizados);
  };

  const addPedido = async (p: Omit<Pedido, "id">) => {
    await addPedidoQuery(p);
    const atualizados = await listPedidos();
    setPedidos(atualizados);
  };

  const updatePedidoStatus = async (id: string, status: Pedido["status"]) => {
    setPedidos((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    await updatePedidoStatusQuery(id, status);
  };

  const addProduto = async (p: Omit<Produto, "id">) => {
    await addProdutoQuery(p);
    const atualizados = await listProdutos();
    setProdutos(atualizados);
  };

  const updateProduto = async (id: string, p: Omit<Produto, "id">) => {
    await updateProdutoQuery(id, p);
    const atualizados = await listProdutos();
    setProdutos(atualizados);
  };

  const deleteProduto = async (id: string) => {
    await deleteProdutoQuery(id);
    setProdutos((prev) => prev.filter((p) => p.id !== id));
  };

  const addTransacao = async (t: Omit<Transacao, "id">) => {
    await addTransacaoQuery(t);
    const atualizadas = await listTransacoes();
    setTransacoes(atualizadas);
  };

  const value = useMemo(
    () => ({
      profile,
      clientes,
      pedidos,
      produtos,
      transacoes,
      carregando,
      addCliente,
      addPedido,
      updatePedidoStatus,
      addProduto,
      updateProduto,
      deleteProduto,
      addTransacao,
    }),
    [profile, clientes, pedidos, produtos, transacoes, carregando]
  );

  return <ChefIAContext.Provider value={value}>{children}</ChefIAContext.Provider>;
}

export function useChefIA() {
  const ctx = useContext(ChefIAContext);
  if (!ctx) throw new Error("useChefIA precisa estar dentro de <ChefIAProvider>");
  return ctx;
}
