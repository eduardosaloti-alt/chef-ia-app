"use client";

import { useEffect } from "react";

// Registra o service worker do PWA (public/sw.js) assim que o app
// carrega no navegador. Nao interfere em nada do funcionamento atual;
// se o registro falhar por qualquer motivo, o site continua normal.
export default function RegisterServiceWorker() {
    useEffect(() => {
          if (typeof window === "undefined") return;
          if (!("serviceWorker" in navigator)) return;

                  navigator.serviceWorker.register("/sw.js").catch((error) => {
                          console.error("Falha ao registrar o service worker:", error);
                  });
    }, []);

  return null;
}
