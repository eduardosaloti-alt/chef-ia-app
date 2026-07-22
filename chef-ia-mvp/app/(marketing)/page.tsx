import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PipingDivider } from "@/components/ui/piping-divider";

export default function LandingPage() {
  return (
    <div className="bg-cream dark:bg-cacau">
      {/* Header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <p className="font-display text-2xl italic text-framboesa">Chef IA</p>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-cacau/70 dark:text-cream/70">Entrar</Link>
          <Link href="https://cheffia.site/">
            <Button>Comecar gratis</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pb-16 pt-12 text-center">
        <Badge tone="dourado" className="mb-6">Restam vagas de fundadora, R$19,90/mes para sempre</Badge>
        <h1 className="font-display text-4xl leading-tight sm:text-6xl">
          A inteligencia artificial <em className="text-framboesa not-italic">da confeitaria</em>.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-cacau/70 dark:text-cream/70">
          Precifique certo, organize seus pedidos e nunca mais venda no prejuizo.
          Tudo em um so lugar, feito para quem vive de confeitar.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="https://cheffia.site/">
            <Button>Quero organizar meu negocio</Button>
          </Link>
        </div>
        <p className="mt-4 text-sm text-cacau/60 dark:text-cream/60">
          Nao sabe se e pra voce?{" "}
          <Link href="/quiz" className="font-medium text-framboesa underline underline-offset-2">
            Faca o teste rapido de 1 minuto
          </Link>
        </p>
        <PipingDivider className="mx-auto mt-16 h-4 w-24 text-framboesa/40" />
      </section>

      {/* Dor -> Solucao */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card>
            <p className="mb-2 text-2xl">🧁</p>
            <h3 className="mb-1 font-display text-lg">Precificacao sem achismo</h3>
            <p className="text-sm text-cacau/60 dark:text-cream/60">
              A calculadora inteligente considera ingredientes, seu tempo e custos fixos, nunca mais venda por menos do que vale.
            </p>
          </Card>
          <Card>
            <p className="mb-2 text-2xl">📅</p>
            <h3 className="mb-1 font-display text-lg">Pedidos e agenda organizados</h3>
            <p className="text-sm text-cacau/60 dark:text-cream/60">
              Veja todas as suas entregas do mes em um calendario simples e nunca mais esqueca um prazo.
            </p>
          </Card>
          <Card>
            <p className="mb-2 text-2xl">💰</p>
            <h3 className="mb-1 font-display text-lg">Fluxo de caixa real</h3>
            <p className="text-sm text-cacau/60 dark:text-cream/60">
              Saiba exatamente quanto entra, quanto sai, e quanto sobra de verdade no fim do mes.
            </p>
          </Card>
        </div>
      </section>

      {/* Preco */}
      <section className="mx-auto max-w-md px-6 pb-24 text-center">
        <Card>
          <Badge tone="dourado" className="mb-3">Oferta de fundadora</Badge>
          <p className="font-display text-4xl">
            R$ 19,90<span className="text-base text-cacau/50 dark:text-cream/50">/mes</span>
          </p>
          <p className="mt-2 text-sm text-cacau/60 dark:text-cream/60">
            Travado para sempre, exclusivo para as 100 primeiras confeiteiras. Depois disso, o plano volta para R$39,90/mes.
          </p>
          <Link href="https://cheffia.site/">
            <Button className="mt-6 w-full">Garantir minha vaga</Button>
          </Link>
        </Card>
      </section>
    </div>
  );
}
