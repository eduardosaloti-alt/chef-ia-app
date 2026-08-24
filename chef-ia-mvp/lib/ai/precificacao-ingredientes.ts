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

/**
 * Apelidos aceitos para cada unidade, para permitir que a confeiteira
 * digite a quantidade do jeito que for mais natural pra ela: "1kg",
 * "1 quilo", "200gr", "200 gramas", ou so o numero (200, 1000...).
 * As chaves ja estao em minusculo (o texto digitado e normalizado
 * antes de comparar).
 */
const UNIDADES_ACEITAS: Record<string, string> = {
  kg: "kg",
  kgs: "kg",
  quilo: "kg",
  quilos: "kg",
  quilograma: "kg",
  quilogramas: "kg",
  g: "g",
  gr: "g",
  grs: "g",
  grama: "g",
  gramas: "g",
  ml: "ml",
  mililitro: "ml",
  mililitros: "ml",
  l: "L",
  lt: "L",
  litro: "L",
  litros: "L",
  un: "un",
  und: "un",
  unid: "un",
  unidade: "un",
  unidades: "un",
};

export interface QuantidadeDigitada {
  valor: number;
  unidade?: string;
}

/**
 * Interpreta o texto digitado num campo de quantidade. Aceita tanto um
 * numero puro (ex: "200", "1,5") quanto um numero com a unidade colada
 * ou separada (ex: "1kg", "200gr", "1,5 kg"). Quando reconhece uma
 * unidade, ela e retornada para que o campo "Un." seja atualizado
 * automaticamente junto.
 */
export function interpretarQuantidade(textoDigitado: string): QuantidadeDigitada {
  const texto = textoDigitado.trim().toLowerCase().replace(",", ".");
  if (!texto) return { valor: 0 };

  const numeroMatch = texto.match(/-?\d+(?:\.\d+)?/);
  if (!numeroMatch) return { valor: 0 };

  const valor = parseFloat(numeroMatch[0]);
  const restante = texto.slice((numeroMatch.index ?? 0) + numeroMatch[0].length).trim();
  const unidade = restante ? UNIDADES_ACEITAS[restante] : undefined;

  return { valor: isNaN(valor) ? 0 : valor, unidade };
}
