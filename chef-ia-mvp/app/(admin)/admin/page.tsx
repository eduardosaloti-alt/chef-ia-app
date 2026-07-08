/**
 * NOTA DE IMPLEMENTAÇÃO: em produção, estas métricas devem vir de uma
 * query agregada no Supabase (contagem de profiles por plano, soma de
 * assinaturas ativas por valor, etc.), protegida por uma policy de RLS
 * que só libera acesso para usuários com role = "admin".
 */
const metricas = [
  { label: "MRR (receita recorrente mensal)", valor: "R$ 1.990,00" },
  { label: "Assinantes ativos", valor: "100" },
  { label: "Vagas de fundadora restantes", valor: "0 / 100" },
  { label: "Novos cadastros (7 dias)", valor: "18" },
  { label: "Churn mensal", valor: "2,1%" },
];

export default function AdminPage() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {metricas.map((m) => (
        <div key={m.label} className="rounded-swirl border border-cream/10 bg-cacau-soft/40 p-6">
          <p className="text-xs text-cream/50">{m.label}</p>
          <p className="mt-2 font-mono text-2xl">{m.valor}</p>
        </div>
      ))}
    </div>
  );
}
