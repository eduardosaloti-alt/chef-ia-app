import type { Ingrediente } from "@/types";

/**
 * Calculo de precificacao baseado em uma lista de ingredientes (tabela
 * editavel), no estilo "custo por receita" usado por confeiteiras:
 * custo do item = (quantidade usada na receita / quantidade do pacote) * preco do pacote.
 */

export function calcularCustoIngrediente(ing: Ingrediente): number {
  if (!ing.quantidadePacote) return 0;
  return (ing.quantidadeUsada / ing.quantidadePacote) * ing.precoPacote;
}

export function calcularCustoTotalIngredientes(ingredientes: Ingrediente[]): number {
  return ingredientes.reduce((soma, ing) => soma + calcularCustoIngrediente(ing), 0);
}

export interface ResultadoPrecificacaoIngredientes {
  custoMateriaPrima: number;
  custoComExtras: number;
  precoSugerido: number;
  precoMinimo: number;
  precoMaximo: number;
}

export function calcularPrecificacaoIngredientes(
  ingredientes: Ingrediente[],
  custosExtrasPercentual: number,
  margemDesejada: number
): ResultadoPrecificacaoIngredientes {
  const custoMateriaPrima = calcularCustoTotalIngredientes(ingredientes);
  const custoComExtras = custoMateriaPrima * (1 + (custosExtrasPercentual || 0) / 100);
  const margem = margemDesejada || 0;
  const precoSugerido = custoComExtras * (1 + margem / 100);
  const margemMinima = Math.max(margem - 30, 0);
  const margemMaxima = margem + 30;
  const precoMinimo = custoComExtras * (1 + margemMinima / 100);
  const precoMaximo = custoComExtras * (1 + margemMaxima / 100);
  return { custoMateriaPrima, custoComExtras, precoSugerido, precoMinimo, precoMaximo };
}

export function novoIngrediente(): Ingrediente {
  return { nome: "", quantidadeUsada: 0, unidade: "g", quantidadePacote: 0, precoPacote: 0 };
}
