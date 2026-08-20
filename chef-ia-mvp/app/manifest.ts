import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
          name: "Chef IA - Assistente de confeitaria",
          short_name: "Chef IA",
          description: "Gestao completa e inteligencia artificial para confeiteiras: precificacao, pedidos, agenda e fluxo de caixa em um so lugar.",
          start_url: "/dashboard",
          scope: "/",
          display: "standalone",
          orientation: "portrait",
          background_color: "#FBF3EA",
          theme_color: "#8B2E43",
          lang: "pt-BR",
          icons: [
            {
                      src: "/icons/icon.svg",
                      sizes: "512x512",
                      type: "image/svg+xml",
                      purpose: "any",
            },
            {
                      src: "/icons/icon-maskable.svg",
                      sizes: "512x512",
                      type: "image/svg+xml",
                      purpose: "maskable",
            },
                ],
    };
}
