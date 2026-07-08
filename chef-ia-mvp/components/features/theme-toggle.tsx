"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [escuro, setEscuro] = useState(false);

  useEffect(() => {
    const salvo = localStorage.getItem("chefia-theme");
    const preferido = salvo === "escuro" || (!salvo && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setEscuro(preferido);
    document.documentElement.classList.toggle("dark", preferido);
  }, []);

  function alternar() {
    const novo = !escuro;
    setEscuro(novo);
    document.documentElement.classList.toggle("dark", novo);
    localStorage.setItem("chefia-theme", novo ? "escuro" : "claro");
  }

  return (
    <button
      onClick={alternar}
      aria-label={escuro ? "Ativar modo claro" : "Ativar modo escuro"}
      className="flex items-center justify-center rounded-full p-2 text-cacau/60 transition-colors hover:bg-cream-soft focus-ring dark:text-cream/60 dark:hover:bg-cacau-soft"
    >
      {escuro ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
