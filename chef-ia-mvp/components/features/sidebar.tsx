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
  Menu,
  X,
} from "lucide-react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { PipingDivider } from "@/components/ui/piping-divider";
import { ThemeToggle } from "@/components/features/theme-toggle";
import { createClient } from "@/lib/supabase/client";

const links = [
  { href: "/dashboard", label: "Painel", icon: LayoutDashboard },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/agenda", label: "Agenda", icon: CalendarDays },
  { href: "/pedidos", label: "Pedidos", icon: ClipboardList },
  { href: "/calculadora", label: "Precificação", icon: Calculator },
  { href: "/caixa", label: "Fluxo de caixa", icon: Wallet },
  { href: "/assinatura", label: "Assinatura", icon: CreditCard },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function sair() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  function renderLinks(onNavigate?: () => void) {
    return (
      <nav className="flex flex-1 flex-col gap-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href as any}
              onClick={onNavigate}
              className={clsx(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-framboesa/10 font-medium text-framboesa-dark dark:text-framboesa-light"
                  : "text-cacau/70 hover:bg-cream-soft dark:text-cream/70 dark:hover:bg-cacau-soft"
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between border-b border-cacau/10 px-4 py-3 dark:border-cream/10 md:hidden">
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
                <p className="mt-1 text-xs text-cacau/50 dark:text-cream/50">Doces da Ana</p>
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

      <aside className="hidden w-64 shrink-0 flex-col border-r border-cacau/10 px-5 py-8 dark:border-cream/10 md:flex">
        <div className="mb-8 flex items-start justify-between px-2">
          <div>
            <p className="font-display text-2xl italic text-framboesa">Chef IA</p>
            <p className="mt-1 text-xs text-cacau/50 dark:text-cream/50">Doces da Ana</p>
          </div>
          <ThemeToggle />
        </div>
        {renderLinks()}
        <button
          onClick={sair}
          className="mb-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-cacau/60 transition-colors hover:bg-cream-soft dark:text-cream/60 dark:hover:bg-cacau-soft"
        >
          <LogOut size={18} />
          Sair
        </button>
        <PipingDivider className="mx-auto mb-3 h-3 w-14 text-framboesa/40" />
        <p className="text-center text-[11px] text-cacau/40 dark:text-cream/40">Fundadora · R$19,90/mês</p>
      </aside>
    </>
  );
}
