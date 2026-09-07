"use client";

/**
 * Helper pro Meta Pixel (Facebook/Instagram Ads).
 *
 * O pixel so e carregado se a variavel de ambiente NEXT_PUBLIC_META_PIXEL_ID
 * estiver configurada (ver app/layout.tsx) — sem ela, essas chamadas nao
 * fazem nada, entao e seguro chamar em qualquer lugar mesmo antes do pixel
 * estar configurado na Vercel.
 */

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

export function trackMetaPixel(evento: string, dados?: Record<string, unknown>) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("track", evento, dados);
}
