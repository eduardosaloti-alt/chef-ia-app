import { clsx } from "clsx";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 focus-ring disabled:opacity-50 disabled:cursor-not-allowed",
        variant === "primary" && "bg-framboesa text-cream hover:bg-framboesa-dark",
        variant === "secondary" && "bg-cream-soft text-cacau hover:bg-dourado-light dark:bg-cacau-soft dark:text-cream",
        variant === "ghost" && "bg-transparent text-cacau hover:bg-cream-soft dark:text-cream dark:hover:bg-cacau-soft",
        className
      )}
      {...props}
    />
  );
}
