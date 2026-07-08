export interface EntradaPrecificacao {
  custoIngredientes: number;
  horasTrabalho: number;
  valorHora: number;
  custoFixoMensal: number;
  quantidadeProduzidaMes: number;
  margemDesejada: number; // percentual, ex: 40
}

export interface ResultadoPrecificacao {
  custoMaoDeObra: number;
  custoFixoRateado: number;
  custoTotal: number;
  precoSugerido: number;
  explicacao: string;
}

/**
 * Cálculo determinístico do preço sugerido.
 * Em produção, o texto de `explicacao` deve ser gerado pela API de IA
 * (ver /app/api/precificacao/route.ts), com o mesmo resultado numérico
 * como contexto, para dar uma explicação personalizada e em linguagem natural.
 */
export function calcularPreco(entrada: EntradaPrecificacao): ResultadoPrecificacao {
  const custoMaoDeObra = entrada.horasTrabalho * entrada.valorHora;
  const custoFixoRateado =
    entrada.quantidadeProduzidaMes > 0
      ? entrada.custoFixoMensal / entrada.quantidadeProduzidaMes
      : entrada.custoFixoMensal;

  const custoTotal = entrada.custoIngredientes + custoMaoDeObra + custoFixoRateado;
  const precoSugerido = custoTotal / (1 - entrada.margemDesejada / 100);

  const explicacao = `Esse valor cobre R$ ${entrada.custoIngredientes.toFixed(2)} de ingredientes, R$ ${custoMaoDeObra.toFixed(2)} da sua hora de trabalho e R$ ${custoFixoRateado.toFixed(2)} de custos fixos rateados. Depois de cobrir tudo isso, ainda sobram ${entrada.margemDesejada}% de margem de lucro real para você.`;

  return {
    custoMaoDeObra,
    custoFixoRateado,
    custoTotal,
    precoSugerido: Math.round(precoSugerido * 100) / 100,
    explicacao,
  };
}
