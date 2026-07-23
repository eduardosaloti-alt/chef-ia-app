"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  ClipboardList,
  Calculator,
  Wallet,
  CreditCard,
  KeyRound,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { PipingDivider } from "@/components/ui/piping-divider";
import { ThemeToggle } from "@/components/features/theme-toggle";
import { createClient } from "@/lib/supabase/client";
import { useChefIA } from "@/lib/store";

const links = [
  { href: "/dashboard", label: "Painel", icon: LayoutDashboard },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/agenda", label: "Agenda", icon: CalendarDays },
  { href: "/pedidos", label: "Pedidos", icon: ClipboardList },
  { href: "/calculadora", label: "Precificação", icon: Calculator },
  { href: "/caixa", label: "Fluxo de caixa", icon: Wallet },
  { href: "/assinatura", label: "Assinatura", icon: CreditCard },
  { href: "/conta", label: "Minha conta", icon: KeyRound },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [recolhido, setRecolhido] = useState(false);
    const { profile } = useChefIA();

  async function sair() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  function renderLinks(onNavigate?: () => void, minimizado?: boolean) {
    return (
      <nav className="flex flex-1 flex-col gap-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href as any}
              onClick={onNavigate}
              title={minimizado ? label : undefined}
              className={clsx(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                minimizado && "justify-center px-2",
                active
                  ? "bg-framboesa/10 font-medium text-framboesa-dark dark:text-framboesa-light"
                  : "text-cacau/70 hover:bg-cream-soft dark:text-cream/70 dark:hover:bg-cacau-soft"
              )}
            >
              <Icon size={18} />
              {!minimizado && label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between border-b border-cacau/10 px-4 py-3 dark:border-cream/10 hidden">
        <p className="font-display text-xl italic text-framboesa">Chef IA</p>
        <button
          onClick={() => setOpen(true)}
          aria-label="Abrir menu"
          className="flex items-center justify-center rounded-full p-2 text-cacau/70 hover:bg-cream-soft dark:text-cream/70 dark:hover:bg-cacau-soft"
        >
          <Menu size={22} />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="relative flex w-64 flex-col bg-cream px-5 py-8 dark:bg-cacau">
            <div className="mb-8 flex items-start justify-between px-2">
              <div>
                <p className="font-display text-2xl italic text-framboesa">Chef IA</p>
                              <p className="mt-1 text-xs text-cacau/50 dark:text-cream/50">{profile.nomeNegocio}</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Fechar menu"
                className="flex items-center justify-center rounded-full p-2 text-cacau/60 hover:bg-cream-soft dark:text-cream/60 dark:hover:bg-cacau-soft"
              >
                <X size={20} />
              </button>
            </div>
            {renderLinks(() => setOpen(false))}
            <button
              onClick={sair}
              className="mb-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-cacau/60 transition-colors hover:bg-cream-soft dark:text-cream/60 dark:hover:bg-cacau-soft"
            >
              <LogOut size={18} />
              Sair
            </button>
          </div>
        </div>
      )}

      <aside
        className={clsx(
          "relative flex shrink-0 flex-col border-r border-cacau/10 py-8 dark:border-cream/10 transition-all duration-200",
          recolhido ? "w-20 px-3" : "w-64 px-5"
        )}
      >
        <button
          onClick={() => setRecolhido(!recolhido)}
          aria-label={recolhido ? "Expandir menu" : "Minimizar menu"}
          className="absolute -right-3 top-9 flex h-6 w-6 items-center justify-center rounded-full border border-cacau/10 bg-cream text-cacau/70 shadow-sm hover:bg-cream-soft dark:border-cream/10 dark:bg-cacau dark:text-cream/70 dark:hover:bg-cacau-soft"
        >
          {recolhido ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
        <div className="mb-8 flex items-start justify-between px-2">
          {!recolhido && (
            <div>
              <p className="font-display text-2xl italic text-framboesa">Chef IA</p>
                                          <p className="mt-1 text-xs text-cacau/50 dark:text-cream/50">{profile.nomeNegocio}</p>
            </div>
          )}
          {!recolhido && <ThemeToggle />}
        </div>
        {renderLinks(undefined, recolhido)}
        <button
          onClick={sair}
          title={recolhido ? "Sair" : undefined}
          className={clsx(
            "mb-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-cacau/60 transition-colors hover:bg-cream-soft dark:text-cream/60 dark:hover:bg-cacau-soft",
            recolhido && "justify-center px-2"
          )}
        >
          <LogOut size={18} />
          {!recolhido && "Sair"}
        </button>
        {!recolhido && (
          <>
            <PipingDivider className="mx-auto mb-3 h-3 w-14 text-framboesa/40" />
            <p className="text-center text-[11px] text-cacau/40 dark:text-cream/40">Fundadora · R$19,90/mês</p>
          </>
        )}
      </aside>
    </>
  );
}
