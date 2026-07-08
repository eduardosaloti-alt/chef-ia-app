import { clsx } from "clsx";
import type { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "framboesa" | "dourado" | "pistache" | "neutro";
}

export function Badge({ className, tone = "neutro", ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        tone === "framboesa" && "bg-framboesa/10 text-framboesa-dark dark:text-framboesa-light",
        tone === "dourado" && "bg-dourado/15 text-dourado dark:text-dourado-light",
        tone === "pistache" && "bg-pistache/15 text-pistache",
        tone === "neutro" && "bg-cacau/10 text-cacau dark:bg-cream/10 dark:text-cream",
        className
      )}
      {...props}
    />
  );
}
