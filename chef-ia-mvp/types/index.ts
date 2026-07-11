export type Plano = "gratuito" | "fundador" | "pro" | "premium";

export interface Profile {
  id: string;
  nome: string;
  nomeNegocio: string;
  plano: Plano;
  precoTravado?: number;
  fundador: boolean;
}

export interface Cliente {
  id: string;
  nome: string;
  whatsapp: string;
  aniversario?: string; // ISO date
  observacoes?: string;
}

export type StatusPedido = "novo" | "producao" | "entregue" | "pago" | "cancelado";

export interface Pedido {
  id: string;
  clienteId: string;
  produtoDescricao: string;
  valor: number;
  dataEntrega: string; // ISO date
  status: StatusPedido;
}

export interface Ingrediente {
  nome: string;
  quantidadeUsada: number;
  unidade: string; // ex: "g", "ml", "un"
  quantidadePacote: number;
  precoPacote: number;
}

export interface Produto {
  id: string;
  nome: string;
  categoria?: string;
  rendimento?: string; // ex: "1 bolo", "20 unidades"
  ingredientes: Ingrediente[];
  custosExtrasPercentual: number; // ex: 20 (%)
  margemDesejada: number; // markup percentual, ex: 150
  custoIngredientes?: number;
  custoMaoDeObra?: number;
  custoFixoRateado?: number;
  precoSugerido?: number;
}

export type TipoTransacao = "entrada" | "saida";

export interface Transacao {
  id: string;
  tipo: TipoTransacao;
  categoria: string;
  descricao: string;
  valor: number;
  data: string; // ISO date
}
