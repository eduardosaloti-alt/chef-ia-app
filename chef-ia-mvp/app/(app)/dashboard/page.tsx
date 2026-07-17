"use client";

import { useChefIA } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const statusLabel: Record<string, { label: string; tone: "framboesa" | "dourado" | "pistache" | "neutro" }> = {
  novo: { label: "Novo", tone: "neutro" },
  producao: { label: "Em produção", tone: "dourado" },
  entregue: { label: "Entregue", tone: "pistache" },
  pago: { label: "Pago", tone: "pistache" },
  cancelado: { label: "Cancelado", tone: "framboesa" },
};

export default function DashboardPage() {
  const { pedidos, clientes, transacoes, profile } = useChefIA();

  const faturamentoMes = transacoes
    .filter((t) => t.tipo === "entrada")
    .reduce((acc, t) => acc + t.valor, 0);
  const despesasMes = transacoes
    .filter((t) => t.tipo === "saida")
    .reduce((acc, t) => acc + t.valor, 0);
  const lucroEstimado = faturamentoMes - despesasMes;

  const proximosPedidos = [...pedidos]
    .sort((a, b) => a.dataEntrega.localeCompare(b.dataEntrega))
    .slice(0, 5);

  return (
    <div className="animate-fade-up">
      <header className="mb-8">
        <h1 className="font-display text-3xl">Boa tarde, {profile.nome?.split(" ")[0] || "Chef"} 👋</h1>
        <p className="mt-1 text-cacau/60 dark:text-cream/60">
          Aqui está o resumo do seu negócio hoje.
        </p>
      </header>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="text-xs text-cacau/50 dark:text-cream/50">Faturamento do mês</p>
          <p className="mt-2 font-mono text-2xl font-medium">
            R$ {faturamentoMes.toFixed(2)}
          </p>
        </Card>
        <Card>
          <p className="text-xs text-cacau/50 dark:text-cream/50">Lucro estimado</p>
          <p className="mt-2 font-mono text-2xl font-medium text-pistache">
            R$ {lucroEstimado.toFixed(2)}
          </p>
        </Card>
        <Card>
          <p className="text-xs text-cacau/50 dark:text-cream/50">Pedidos em produção</p>
          <p className="mt-2 font-mono text-2xl font-medium">
            {pedidos.filter((p) => p.status === "producao").length}
          </p>
        </Card>
        <Card>
          <p className="text-xs text-cacau/50 dark:text-cream/50">Clientes cadastrados</p>
          <p className="mt-2 font-mono text-2xl font-medium">{clientes.length}</p>
        </Card>
      </div>

      <Card>
        <h2 className="mb-4 font-display text-xl">Próximas entregas</h2>
        <div className="flex flex-col divide-y divide-cacau/10 dark:divide-cream/10">
          {proximosPedidos.map((p) => {
            const cliente = clientes.find((c) => c.id === p.clienteId);
            const status = statusLabel[p.status];
            return (
              <div key={p.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium">{p.produtoDescricao}</p>
                  <p className="text-xs text-cacau/50 dark:text-cream/50">
                    {cliente?.nome} · {new Date(p.dataEntrega).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm">R$ {p.valor.toFixed(2)}</span>
                  <Badge tone={status.tone}>{status.label}</Badge>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
