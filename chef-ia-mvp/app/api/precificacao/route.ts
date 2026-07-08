import { NextResponse } from "next/server";
import { calcularPreco, type EntradaPrecificacao } from "@/lib/ai/precificacao";

/**
 * POST /api/precificacao
 * Recebe os custos informados pela confeiteira e retorna o preço sugerido.
 *
 * A versão atual usa apenas a fórmula determinística de `calcularPreco`.
 * Para ativar a explicação gerada por IA (linguagem mais natural e
 * personalizada), adicione aqui uma chamada à API da Anthropic, por exemplo:
 *
 *   const resposta = await fetch("https://api.anthropic.com/v1/messages", {
 *     method: "POST",
 *     headers: { "content-type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY! },
 *     body: JSON.stringify({
 *       model: "claude-sonnet-4-6",
 *       max_tokens: 300,
 *       messages: [{ role: "user", content: `Explique de forma simples por que o preço ideal é R$${resultado.precoSugerido}...` }],
 *     }),
 *   });
 */
export async function POST(request: Request) {
  const entrada = (await request.json()) as EntradaPrecificacao;

  if (
    typeof entrada.custoIngredientes !== "number" ||
    typeof entrada.margemDesejada !== "number"
  ) {
    return NextResponse.json({ erro: "Dados de entrada inválidos." }, { status: 400 });
  }

  const resultado = calcularPreco(entrada);
  return NextResponse.json(resultado);
}
