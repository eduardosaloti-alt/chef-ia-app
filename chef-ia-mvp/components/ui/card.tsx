import { clsx } from "clsx";
import type { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "rounded-swirl border border-cacau/10 bg-white/60 p-6 shadow-sm backdrop-blur-sm dark:border-cream/10 dark:bg-cacau-soft/40",
        className
      )}
      {...props}
    />
  );
}
