"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Cliente, Insumo, Pedido, Produto, Profile, Transacao } from "@/types";
import {
    getProfile,
    listClientes,
    addCliente as addClienteQuery,
    listPedidos,
    addPedido as addPedidoQuery,
    updatePedidoStatus as updatePedidoStatusQuery,
    updatePedido as updatePedidoQuery,
    deletePedido as deletePedidoQuery,
    listProdutos,
    addProduto as addProdutoQuery,
    updateProduto as updateProdutoQuery,
    deleteProduto as deleteProdutoQuery,
    listTransacoes,
    addTransacao as addTransacaoQuery,
    updateCliente as updateClienteQuery,
    deleteCliente as deleteClienteQuery,
    updateTransacao as updateTransacaoQuery,
    deleteTransacao as deleteTransacaoQuery,
    listInsumos,
    addInsumo as addInsumoQuery,
    updateInsumo as updateInsumoQuery,
    deleteInsumo as deleteInsumoQuery,
} from "@/lib/supabase/queries";

/**
 * Este store carrega os dados reais do usuario logado a partir do
 * Supabase (lib/supabase/queries.ts). A interface publica (useChefIA)
 * e a mesma de antes, entao nenhuma tela precisa mudar.
 */

interface ChefIAState {
    profile: Profile;
    clientes: Cliente[];
    pedidos: Pedido[];
    produtos: Produto[];
    transacoes: Transacao[];
    insumos: Insumo[];
    carregando: boolean;
    addCliente: (c: Omit<Cliente, "id">) => Promise<void>;
    addPedido: (p: Omit<Pedido, "id">) => Promise<void>;
    updatePedidoStatus: (id: string, status: Pedido["status"]) => Promise<void>;
    updatePedido: (id: string, p: Omit<Pedido, "id">) => Promise<void>;
    deletePedido: (id: string) => Promise<void>;
    addProduto: (p: Omit<Produto, "id">) => Promise<void>;
    updateProduto: (id: string, p: Omit<Produto, "id">) => Promise<void>;
    deleteProduto: (id: string) => Promise<void>;
    addTransacao: (t: Omit<Transacao, "id">) => Promise<void>;
    updateCliente: (id: string, c: Omit<Cliente, "id">) => Promise<void>;
    deleteCliente: (id: string) => Promise<void>;
    updateTransacao: (id: string, t: Omit<Transacao, "id">) => Promise<void>;
    deleteTransacao: (id: string) => Promise<void>;
    addInsumo: (i: Omit<Insumo, "id">) => Promise<void>;
    updateInsumo: (id: string, i: Omit<Insumo, "id">) => Promise<void>;
    deleteInsumo: (id: string) => Promise<void>;
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
    const [insumos, setInsumos] = useState<Insumo[]>([]);
    const [carregando, setCarregando] = useState(true);

  useEffect(() => {
        let ativo = true;
        async function carregar() {
                try {
                          const [perfil, listaClientes, listaPedidos, listaProdutos, listaTransacoes, listaInsumos] =
                                      await Promise.all([
                                                    getProfile(),
                                                    listClientes(),
                                                    listPedidos(),
                                                    listProdutos(),
                                                    listTransacoes(),
                                                    listInsumos(),
                                                  ]);
                          if (!ativo) return;
                          if (perfil) setProfile(perfil);
                          setClientes(listaClientes);
                          setPedidos(listaPedidos);
                          setProdutos(listaProdutos);
                          setTransacoes(listaTransacoes);
                          setInsumos(listaInsumos);
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

  const updatePedido = async (id: string, p: Omit<Pedido, "id">) => {
        await updatePedidoQuery(id, p);
        const atualizados = await listPedidos();
        setPedidos(atualizados);
  };

  const deletePedido = async (id: string) => {
        await deletePedidoQuery(id);
        setPedidos((prev) => prev.filter((p) => p.id !== id));
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

  const updateCliente = async (id: string, c: Omit<Cliente, "id">) => {
        await updateClienteQuery(id, c);
        const atualizados = await listClientes();
        setClientes(atualizados);
  };

  const deleteCliente = async (id: string) => {
        await deleteClienteQuery(id);
        setClientes((prev) => prev.filter((c) => c.id !== id));
  };

  const updateTransacao = async (id: string, t: Omit<Transacao, "id">) => {
        await updateTransacaoQuery(id, t);
        const atualizadas = await listTransacoes();
        setTransacoes(atualizadas);
  };

  const deleteTransacao = async (id: string) => {
        await deleteTransacaoQuery(id);
        setTransacoes((prev) => prev.filter((t) => t.id !== id));
  };

  const addInsumo = async (i: Omit<Insumo, "id">) => {
        await addInsumoQuery(i);
        const atualizados = await listInsumos();
        setInsumos(atualizados);
  };

  const updateInsumo = async (id: string, i: Omit<Insumo, "id">) => {
        await updateInsumoQuery(id, i);
        const atualizados = await listInsumos();
        setInsumos(atualizados);
  };

  const deleteInsumo = async (id: string) => {
        await deleteInsumoQuery(id);
        setInsumos((prev) => prev.filter((i) => i.id !== id));
  };

  const value = useMemo(
        () => ({
                profile,
                clientes,
                pedidos,
                produtos,
                transacoes,
                insumos,
                carregando,
                addCliente,
                addPedido,
                updatePedidoStatus,
                updatePedido,
                deletePedido,
                addProduto,
                updateProduto,
                deleteProduto,
                addTransacao,
                updateCliente,
                deleteCliente,
                updateTransacao,
                deleteTransacao,
                addInsumo,
                updateInsumo,
                deleteInsumo,
        }),
        [profile, clientes, pedidos, produtos, transacoes, insumos, carregando]
      );

  return <ChefIAContext.Provider value={value}>{children}</ChefIAContext.Provider>;
}

export function useChefIA() {
    const ctx = useContext(ChefIAContext);
    if (!ctx) throw new Error("useChefIA precisa estar dentro de <ChefIAProvider>");
    return ctx;
}

  
