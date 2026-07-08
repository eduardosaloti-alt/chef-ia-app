import { clsx } from "clsx";
import type { InputHTMLAttributes, LabelHTMLAttributes } from "react";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={clsx(
        "w-full rounded-xl border border-cacau/15 bg-white px-4 py-2.5 text-sm text-cacau placeholder:text-cacau/40 focus-ring dark:border-cream/15 dark:bg-cacau-soft dark:text-cream",
        className
      )}
      {...props}
    />
  );
}

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={clsx("mb-1.5 block text-sm font-medium text-cacau/80 dark:text-cream/80", className)} {...props} />;
}
