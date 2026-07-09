import { createClient } from "@/lib/supabase/client";
import type { Cliente, Pedido, Produto, Profile, Transacao } from "@/types";

/**
 * Estas funções espelham exatamente os métodos de `lib/store.tsx`.
 * Quando o Supabase estiver configurado (.env.local preenchido), troque
 * os imports de `useChefIA` pelas funções daqui — nenhuma tela precisa mudar
 * além da forma como os dados chegam (client component com useEffect/useState,
 * ou Server Component chamando estas funções diretamente).
 */

export async function getProfile(): Promise<Profile | null> {
  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", auth.user.id)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    nome: data.nome,
    nomeNegocio: data.nome_negocio,
    plano: data.plano,
    precoTravado: data.preco_travado,
    fundador: data.fundador,
  };
}

export async function listClientes(): Promise<Cliente[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .order("criado_em", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((c) => ({
    id: c.id,
    nome: c.nome,
    whatsapp: c.whatsapp,
    aniversario: c.aniversario,
    observacoes: c.observacoes,
  }));
}

export async function addCliente(c: Omit<Cliente, "id">) {
  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();
  const { error } = await supabase.from("clientes").insert({
    user_id: auth.user?.id,
    nome: c.nome,
    whatsapp: c.whatsapp,
    aniversario: c.aniversario,
    observacoes: c.observacoes,
  });
  if (error) throw error;
}

export async function listPedidos(): Promise<Pedido[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("pedidos")
    .select("*")
    .order("data_entrega", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((p) => ({
    id: p.id,
    clienteId: p.cliente_id,
    produtoDescricao: p.produto_descricao,
    valor: p.valor,
    dataEntrega: p.data_entrega,
    status: p.status,
  }));
}

export async function addPedido(p: Omit<Pedido, "id">) {
  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();
  const { error } = await supabase.from("pedidos").insert({
    user_id: auth.user?.id,
    cliente_id: p.clienteId,
    produto_descricao: p.produtoDescricao,
    valor: p.valor,
    data_entrega: p.dataEntrega,
    status: p.status,
  });
  if (error) throw error;
}

export async function updatePedidoStatus(id: string, status: Pedido["status"]) {
  const supabase = createClient();
  const { error } = await supabase.from("pedidos").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function listProdutos(): Promise<Produto[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("produtos")
    .select("*")
    .order("criado_em", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((p) => ({
    id: p.id,
    nome: p.nome,
    categoria: p.categoria,
    custoIngredientes: p.custo_ingredientes,
    custoMaoDeObra: p.custo_mao_de_obra,
    custoFixoRateado: p.custo_fixo_rateado,
    margemDesejada: p.margem_desejada,
    precoSugerido: p.preco_sugerido,
  }));
}

export async function listTransacoes(): Promise<Transacao[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("transacoes")
    .select("*")
    .order("data", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((t) => ({
    id: t.id,
    tipo: t.tipo,
    categoria: t.categoria,
    descricao: t.descricao,
    valor: t.valor,
    data: t.data,
  }));
}

export async function addTransacao(t: Omit<Transacao, "id">) {
  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();
  const { error } = await supabase.from("transacoes").insert({
    user_id: auth.user?.id,
    tipo: t.tipo,
    categoria: t.categoria,
    descricao: t.descricao,
    valor: t.valor,
    data: t.data,
  });
  if (error) throw error;
}

/** Conta quantas vagas de fundadora já foram preenchidas (para a landing page) */
export async function contarFundadores(): Promise<number> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("contar_fundadores");
  if (error) return 0;
  return data as number;
}
