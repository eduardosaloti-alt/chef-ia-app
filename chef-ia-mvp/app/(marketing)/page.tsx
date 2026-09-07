import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PipingDivider } from "@/components/ui/piping-divider";

const ICONS = {
  sparkles: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Sparkles/3D/sparkles_3d.png",
  robot: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Robot/3D/robot_3d.png",
  cupcake: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Cupcake/3D/cupcake_3d.png",
  calendar: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Calendar/3D/calendar_3d.png",
  moneyBag: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Money%20bag/3D/money_bag_3d.png",
  partyPopper: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Party%20popper/3D/party_popper_3d.png",
  chartUp: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Chart%20increasing/3D/chart_increasing_3d.png",
};

function IconBadge({ src, alt, size = 56 }: { src: string; alt: string; size?: number }) {
  return (
    <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-framboesa/15 to-dourado/10 p-3 shadow-sm ring-1 ring-framboesa/10">
      <img src={src} alt={alt} width={size} height={size} className="drop-shadow-sm" />
    </span>
  );
}

export default function LandingPage() {
  return (
    <div className="bg-cream dark:bg-cacau">
      {/* Header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <p className="flex items-center gap-2 font-display text-2xl italic text-framboesa">
          <img src={ICONS.sparkles} alt="" width={28} height={28} className="not-italic" />
          Chef IA
        </p>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-cacau/70 dark:text-cream/70">Entrar</Link>
          <Link href="https://cheffia.site/">
            <Button>Comecar gratis</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 h-[28rem] w-[42rem] -translate-x-1/2 rounded-full bg-framboesa/25 blur-[100px] dark:bg-framboesa/20"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 right-0 h-72 w-72 rounded-full bg-dourado/25 blur-[90px] dark:bg-dourado/15"
        />

        <div className="relative mx-auto max-w-3xl px-6 pb-16 pt-12 text-center">
          <div className="mb-6 flex justify-center -space-x-3">
            <img
              src={ICONS.robot}
              alt=""
              width={64}
              height={64}
              className="-rotate-6 rounded-2xl bg-white/70 p-1.5 shadow-lg ring-1 ring-framboesa/10 dark:bg-cacau-soft/60"
            />
            <img
              src={ICONS.cupcake}
              alt=""
              width={64}
              height={64}
              className="translate-y-2 rotate-6 rounded-2xl bg-white/70 p-1.5 shadow-lg ring-1 ring-framboesa/10 dark:bg-cacau-soft/60"
            />
          </div>
          <Badge tone="dourado" className="mb-6">Restam vagas de fundadora, R$29,90/mes para sempre</Badge>
          <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            A inteligencia artificial <em className="text-framboesa not-italic">da confeitaria</em>.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg font-medium text-cacau/70 dark:text-cream/70">
            Precifique certo, organize seus pedidos e nunca mais venda no prejuizo.
            Tudo em um so lugar, feito para quem vive de confeitar.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="https://cheffia.site/">
              <Button className="shadow-lg shadow-framboesa/30">Quero organizar meu negocio</Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-cacau/60 dark:text-cream/60">
            Nao sabe se e pra voce?{" "}
            <Link href="/quiz" className="font-semibold text-framboesa underline underline-offset-2">
              Faca o teste rapido de 1 minuto
            </Link>
          </p>
          <PipingDivider className="mx-auto mt-16 h-4 w-24 text-framboesa/40" />
        </div>
      </section>

      {/* Dor -> Solucao */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="text-center transition-transform duration-200 hover:-translate-y-1 hover:shadow-md sm:text-left">
            <div className="mb-4 flex justify-center sm:justify-start">
              <IconBadge src={ICONS.cupcake} alt="Precificacao" />
            </div>
            <h3 className="mb-1 font-display text-lg font-semibold">Precificacao sem achismo</h3>
            <p className="text-sm text-cacau/60 dark:text-cream/60">
              A calculadora inteligente considera ingredientes, seu tempo e custos fixos, nunca mais venda por menos do que vale.
            </p>
          </Card>
          <Card className="text-center transition-transform duration-200 hover:-translate-y-1 hover:shadow-md sm:text-left">
            <div className="mb-4 flex justify-center sm:justify-start">
              <IconBadge src={ICONS.calendar} alt="Agenda" />
            </div>
            <h3 className="mb-1 font-display text-lg font-semibold">Pedidos e agenda organizados</h3>
            <p className="text-sm text-cacau/60 dark:text-cream/60">
              Veja todas as suas entregas do mes em um calendario simples e nunca mais esqueca um prazo.
            </p>
          </Card>
          <Card className="text-center transition-transform duration-200 hover:-translate-y-1 hover:shadow-md sm:text-left">
            <div className="mb-4 flex justify-center sm:justify-start">
              <IconBadge src={ICONS.moneyBag} alt="Fluxo de caixa" />
            </div>
            <h3 className="mb-1 font-display text-lg font-semibold">Fluxo de caixa real</h3>
            <p className="text-sm text-cacau/60 dark:text-cream/60">
              Saiba exatamente quanto entra, quanto sai, e quanto sobra de verdade no fim do mes.
            </p>
          </Card>
        </div>
      </section>

      {/* Preco */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 left-1/2 h-96 w-[36rem] -translate-x-1/2 rounded-full bg-framboesa/15 blur-[100px] dark:bg-framboesa/10"
        />
        <div className="relative mx-auto max-w-3xl px-6 pb-24 text-center">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Card className="text-left">
              <div className="mb-3 flex items-center justify-between">
                <Badge tone="dourado">Oferta de fundadora</Badge>
                <img src={ICONS.partyPopper} alt="" width={32} height={32} />
              </div>
              <p className="font-display text-4xl font-semibold">
                R$ 29,90<span className="text-base font-normal text-cacau/50 dark:text-cream/50">/mes</span>
              </p>
              <p className="mt-2 text-sm text-cacau/60 dark:text-cream/60">
                Travado para sempre, exclusivo para as 100 primeiras confeiteiras. Depois disso, o plano volta para R$39,90/mes.
              </p>
              <Link href="https://cheffia.site/">
                <Button className="mt-6 w-full">Garantir minha vaga</Button>
              </Link>
            </Card>
            <Card className="relative text-left ring-2 ring-framboesa/40">
              <div className="mb-3 flex items-center justify-between">
                <Badge tone="pistache">Plano anual · economize 45%</Badge>
                <img src={ICONS.chartUp} alt="" width={32} height={32} />
              </div>
              <p className="font-display text-4xl font-semibold">
                R$ 197<span className="text-base font-normal text-cacau/50 dark:text-cream/50">/ano</span>
              </p>
              <p className="mt-2 text-sm text-cacau/60 dark:text-cream/60">
                Pague uma vez e use o Chef IA o ano inteiro, sai bem mais barato que o plano mensal.
              </p>
              <Link href="https://cheffia.site/">
                <Button className="mt-6 w-full shadow-lg shadow-framboesa/30">Quero o plano anual</Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
