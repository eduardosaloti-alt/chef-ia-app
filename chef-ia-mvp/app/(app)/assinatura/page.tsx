"use client";

import { useState } from "react";
import { useChefIA } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AssinaturaPage() {
  const { profile } = useChefIA();
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function abrirCheckout(plano: "fundador" | "pro") {
    setErro(null);
    setCarregando(true);
    try {
      const resposta = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plano }),
      });
      const dados = await resposta.json();
      if (dados.url) {
        window.location.href = dados.url;
      } else {
        setErro(dados.erro ?? "Não foi possível iniciar o checkout.");
      }
    } catch {
      setErro("Não foi possível conectar ao Stripe agora.");
    } finally {
      setCarregando(false);
    }
  }

  async function abrirPortal() {
    setErro(null);
    setCarregando(true);
    try {
      const resposta = await fetch("/api/checkout/portal", { method: "POST" });
      const dados = await resposta.json();
      if (dados.url) {
        window.location.href = dados.url;
      } else {
        setErro(dados.erro ?? "Não foi possível abrir o portal de faturamento.");
      }
    } catch {
      setErro("Não foi possível conectar ao Stripe agora.");
    } finally {
      setCarregando(false);
    }
  }

  const assinante = profile.plano !== "gratuito";

  return (
    <div className="animate-fade-up max-w-2xl">
      <header className="mb-8">
        <h1 className="font-display text-3xl">Sua assinatura</h1>
        <p className="mt-1 text-cacau/60 dark:text-cream/60">Gerencie seu plano e forma de pagamento.</p>
      </header>

      <Card className="mb-6">
        <div className="mb-2 flex items-center gap-2">
          <p className="font-display text-xl capitalize">Plano {profile.plano}</p>
          {profile.fundador && <Badge tone="dourado">Fundadora</Badge>}
        </div>
        {assinante ? (
          <>
            <p className="font-mono text-2xl">
              R$ {profile.precoTravado?.toFixed(2)}
              <span className="text-sm text-cacau/50 dark:text-cream/50">/mês</span>
            </p>
            {profile.fundador && (
              <p className="mt-2 text-sm text-dourado">
                Preço travado para sempre — obrigada por confiar na Chef IA desde o início. 💛
              </p>
            )}
            <Button className="mt-4" variant="secondary" onClick={abrirPortal} disabled={carregando}>
              Gerenciar pagamento e faturas
            </Button>
          </>
        ) : (
          <>
            <p className="text-sm text-cacau/60 dark:text-cream/60">
              Você está no plano gratuito. Assine o Pro para desbloquear pedidos e clientes ilimitados.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button onClick={() => abrirCheckout("fundador")} disabled={carregando}>
                Quero ser fundadora — R$19,90/mês
              </Button>
              <Button variant="secondary" onClick={() => abrirCheckout("pro")} disabled={carregando}>
                Assinar Pro — R$39,90/mês
              </Button>
            </div>
          </>
        )}
        {erro && <p className="mt-3 text-sm text-framboesa">{erro}</p>}
      </Card>

      <Card>
        <h2 className="mb-3 font-display text-lg">Como funciona o preço de fundadora</h2>
        <p className="text-sm text-cacau/60 dark:text-cream/60">
          As primeiras 100 confeiteiras pagam R$19,90/mês para sempre. Depois de preenchidas as
          100 vagas, o checkout aplica automaticamente o plano Pro por R$39,90/mês.
        </p>
      </Card>
    </div>
  );
}
