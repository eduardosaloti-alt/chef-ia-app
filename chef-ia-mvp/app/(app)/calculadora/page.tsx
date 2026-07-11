"use client";

import { useState } from "react";
import { useChefIA } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { PipingDivider } from "@/components/ui/piping-divider";
import type { Ingrediente, Produto } from "@/types";
import {
  calcularCustoIngrediente,
  calcularPrecificacaoIngredientes,
  novoIngrediente,
} from "@/lib/ai/precificacao-ingredientes";
import { Plus, Trash2 } from "lucide-react";

const SUGESTOES_NOME = ["Bolo confeitado", "Docinhos", "Bolo no pote", "Bolo caseiro", "Bolo de festa"];

const UNIDADES = ["g", "kg", "ml", "L", "un"];

function formatarReal(valor: number) {
  if (!isFinite(valor)) return "R$ 0,00";
  return "R$ " + valor.toFixed(2).replace(".", ",");
}

export default function CalculadoraPage() {
  const { produtos, addProduto, updateProduto, deleteProduto } = useChefIA();

  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [emEdicao, setEmEdicao] = useState(false);
  const [nome, setNome] = useState("");
  const [rendimento, setRendimento] = useState("");
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([novoIngrediente()]);
  const [custosExtrasPercentual, setCustosExtrasPercentual] = useState(20);
  const [margemDesejada, setMargemDesejada] = useState(150);
  const [salvando, setSalvando] = useState(false);

  function iniciarNova(sugestao?: string) {
    setEditandoId(null);
    setNome(sugestao ?? "");
    setRendimento("");
    setIngredientes([novoIngrediente()]);
    setCustosExtrasPercentual(20);
    setMargemDesejada(150);
    setEmEdicao(true);
  }

  function carregarProduto(p: Produto) {
    setEditandoId(p.id);
    setNome(p.nome);
    setRendimento(p.rendimento ?? "");
    setIngredientes(p.ingredientes && p.ingredientes.length > 0 ? p.ingredientes : [novoIngrediente()]);
    setCustosExtrasPercentual(p.custosExtrasPercentual ?? 20);
    setMargemDesejada(p.margemDesejada ?? 150);
    setEmEdicao(true);
  }

  function atualizarIngrediente(index: number, campo: keyof Ingrediente, valor: string) {
    setIngredientes((prev) =>
      prev.map((ing, i) => {
        if (i !== index) return ing;
        if (campo === "nome" || campo === "unidade") {
          return { ...ing, [campo]: valor };
        }
        return { ...ing, [campo]: parseFloat(valor) || 0 };
      })
    );
  }

  function adicionarIngrediente() {
    setIngredientes((prev) => [...prev, novoIngrediente()]);
  }

  function removerIngrediente(index: number) {
    setIngredientes((prev) => prev.filter((_, i) => i !== index));
  }

  const resultado = calcularPrecificacaoIngredientes(ingredientes, custosExtrasPercentual, margemDesejada);

  async function salvar() {
    if (!nome.trim()) return;
    setSalvando(true);
    try {
      const dados = {
        nome: nome.trim(),
        rendimento: rendimento || undefined,
        ingredientes,
        custosExtrasPercentual,
        margemDesejada,
        precoSugerido: Math.round(resultado.precoSugerido * 100) / 100,
      };
      if (editandoId) {
        await updateProduto(editandoId, dados);
      } else {
        await addProduto(dados);
      }
      setEmEdicao(false);
    } finally {
      setSalvando(false);
    }
  }

  async function excluir() {
    if (!editandoId) return;
    await deleteProduto(editandoId);
    setEmEdicao(false);
  }

  return (
    <div className="animate-fade-up">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Precificação</h1>
          <p className="mt-1 text-cacau/60 dark:text-cream/60">
            Monte a tabela de ingredientes de cada produto e descubra o custo real e o preço ideal de venda.
          </p>
        </div>
        {!emEdicao && (
          <Button onClick={() => iniciarNova()}>
            <Plus className="h-4 w-4" /> Nova precificação
          </Button>
        )}
      </header>

      {!emEdicao && (
        <>
          {produtos.length === 0 ? (
            <Card className="mb-6">
              <p className="mb-4 text-sm text-cacau/60 dark:text-cream/60">
                Você ainda não salvou nenhuma precificação. Comece por um destes produtos comuns:
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGESTOES_NOME.map((s) => (
                  <Button key={s} variant="secondary" onClick={() => iniciarNova(s)}>
                    {s}
                  </Button>
                ))}
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {produtos.map((p) => (
                <Card
                  key={p.id}
                  className="cursor-pointer transition hover:shadow-md"
                  onClick={() => carregarProduto(p)}
                >
                  <p className="font-medium">{p.nome}</p>
                  {p.rendimento && (
                    <p className="mt-0.5 text-xs text-cacau/50 dark:text-cream/50">{p.rendimento}</p>
                  )}
                  <p className="mt-2 font-display text-2xl text-framboesa">
                    {formatarReal(p.precoSugerido ?? 0)}
                  </p>
                  <p className="text-xs text-cacau/50 dark:text-cream/50">preço sugerido</p>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {emEdicao && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor="nome-produto">Nome do produto</Label>
                  <Input
                    id="nome-produto"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Bolo no pote"
                  />
                </div>
                <div>
                  <Label htmlFor="rendimento">Rendimento (opcional)</Label>
                  <Input
                    id="rendimento"
                    value={rendimento}
                    onChange={(e) => setRendimento(e.target.value)}
                    placeholder="Ex: 1 bolo de 20cm, 20 unidades..."
                  />
                </div>
              </div>

              {!nome && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {SUGESTOES_NOME.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setNome(s)}
                      className="rounded-full border border-cacau/15 px-3 py-1 text-xs text-cacau/60 hover:bg-cream-soft dark:border-cream/15 dark:text-cream/60 dark:hover:bg-cacau-soft"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-cacau/10 text-left text-xs uppercase tracking-wide text-cacau/50 dark:border-cream/10 dark:text-cream/50">
                      <th className="py-2 pr-2">Ingrediente</th>
                      <th className="py-2 pr-2">Qtd. usada</th>
                      <th className="py-2 pr-2">Un.</th>
                      <th className="py-2 pr-2">Qtd. do pacote</th>
                      <th className="py-2 pr-2">Preço do pacote</th>
                      <th className="py-2 pr-2">Custo</th>
                      <th className="py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {ingredientes.map((ing, index) => (
                      <tr key={index} className="border-b border-cacau/5 dark:border-cream/5">
                        <td className="py-1.5 pr-2">
                          <Input
                            value={ing.nome}
                            onChange={(e) => atualizarIngrediente(index, "nome", e.target.value)}
                            placeholder="Ex: Farinha"
                            className="min-w-[120px]"
                          />
                        </td>
                        <td className="py-1.5 pr-2">
                          <Input
                            type="number"
                            value={ing.quantidadeUsada || ""}
                            onChange={(e) => atualizarIngrediente(index, "quantidadeUsada", e.target.value)}
                            className="w-20"
                          />
                        </td>
                        <td className="py-1.5 pr-2">
                          <select
                            value={ing.unidade}
                            onChange={(e) => atualizarIngrediente(index, "unidade", e.target.value)}
                            className="w-16 rounded-xl border border-cacau/15 bg-white px-2 py-2.5 text-sm text-cacau focus-ring dark:border-cream/15 dark:bg-cacau-soft dark:text-cream"
                          >
                            {UNIDADES.map((u) => (
                              <option key={u} value={u}>
                                {u}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-1.5 pr-2">
                          <Input
                            type="number"
                            value={ing.quantidadePacote || ""}
                            onChange={(e) => atualizarIngrediente(index, "quantidadePacote", e.target.value)}
                            className="w-20"
                          />
                        </td>
                        <td className="py-1.5 pr-2">
                          <Input
                            type="number"
                            value={ing.precoPacote || ""}
                            onChange={(e) => atualizarIngrediente(index, "precoPacote", e.target.value)}
                            className="w-24"
                          />
                        </td>
                        <td className="whitespace-nowrap py-1.5 pr-2 font-mono text-xs text-cacau/70 dark:text-cream/70">
                          {formatarReal(calcularCustoIngrediente(ing))}
                        </td>
                        <td className="py-1.5">
                          <button
                            type="button"
                            onClick={() => removerIngrediente(index)}
                            className="rounded-full p-1.5 text-cacau/40 hover:bg-cream-soft hover:text-framboesa dark:text-cream/40 dark:hover:bg-cacau-soft"
                            aria-label="Remover ingrediente"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Button variant="secondary" className="mt-3" onClick={adicionarIngrediente}>
                <Plus className="h-4 w-4" /> Adicionar ingrediente
              </Button>

              <PipingDivider className="my-5 h-3 w-16 text-dourado" />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor="extras">Custos extras (%)</Label>
                  <Input
                    id="extras"
                    type="number"
                    value={custosExtrasPercentual}
                    onChange={(e) => setCustosExtrasPercentual(parseFloat(e.target.value) || 0)}
                  />
                  <p className="mt-1 text-xs text-cacau/50 dark:text-cream/50">
                    Embalagem, gás, luz, desgaste de equipamentos etc.
                  </p>
                </div>
                <div>
                  <Label htmlFor="margem">Margem de lucro desejada (%)</Label>
                  <Input
                    id="margem"
                    type="number"
                    value={margemDesejada}
                    onChange={(e) => setMargemDesejada(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button onClick={salvar} disabled={salvando || !nome.trim()}>
                  {salvando ? "Salvando..." : "Salvar precificação"}
                </Button>
                <Button variant="ghost" onClick={() => setEmEdicao(false)}>
                  Cancelar
                </Button>
                {editandoId && (
                  <Button variant="ghost" onClick={excluir} className="text-framboesa">
                    Excluir
                  </Button>
                )}
              </div>
            </Card>
          </div>

          <Card className="flex flex-col items-center justify-center text-center">
            <p className="text-xs uppercase tracking-wide text-cacau/50 dark:text-cream/50">
              Total de ingredientes
            </p>
            <p className="mt-1 font-mono text-lg text-cacau dark:text-cream">
              {formatarReal(resultado.custoMateriaPrima)}
            </p>

            <p className="mt-4 text-xs uppercase tracking-wide text-cacau/50 dark:text-cream/50">
              Custo total (com extras)
            </p>
            <p className="mt-1 font-mono text-lg text-cacau dark:text-cream">
              {formatarReal(resultado.custoComExtras)}
            </p>

            <PipingDivider className="my-4 h-3 w-16 text-dourado" />

            <p className="text-xs uppercase tracking-wide text-cacau/50 dark:text-cream/50">Preço sugerido</p>
            <p className="my-2 font-display text-5xl text-framboesa">{formatarReal(resultado.precoSugerido)}</p>
            <p className="max-w-xs text-sm text-cacau/70 dark:text-cream/70">
              Pode vender entre {formatarReal(resultado.precoMinimo)} e {formatarReal(resultado.precoMaximo)}
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}
