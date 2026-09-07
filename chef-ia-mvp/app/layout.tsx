import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import RegisterServiceWorker from "./register-sw";

// ID do Meta Pixel (Gerenciador de Eventos > Fontes de dados). Configurado
// como variavel de ambiente NEXT_PUBLIC_META_PIXEL_ID na Vercel — sem essa
// variavel, o pixel simplesmente nao carrega (nada quebra).
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

const fraunces = Fraunces({
    subsets: ["latin"],
    variable: "--font-fraunces",
    weight: ["400", "500", "600"],
    style: ["normal", "italic"],
});

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
    weight: ["400", "500"],
});

export const metadata: Metadata = {
    title: "Chef IA - A inteligencia artificial da confeitaria",
    description:
          "Gestao completa e inteligencia artificial para confeiteiras: precificacao, pedidos, agenda e fluxo de caixa em um so lugar.",
};

export const viewport: Viewport = {
    themeColor: "#8B2E43",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
          <html lang="pt-BR" className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
                  <body className="font-sans">
                          {META_PIXEL_ID && (
                            <>
                              <Script id="meta-pixel" strategy="afterInteractive">
                                {`
                                  !function(f,b,e,v,n,t,s)
                                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                                  n.queue=[];t=b.createElement(e);t.async=!0;
                                  t.src=v;s=b.getElementsByTagName(e)[0];
                                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                                  'https://connect.facebook.net/en_US/fbevents.js');
                                  fbq('init', '${META_PIXEL_ID}');
                                  fbq('track', 'PageView');
                                `}
                              </Script>
                              <noscript>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  height={1}
                                  width={1}
                                  style={{ display: "none" }}
                                  src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
                                  alt=""
                                />
                              </noscript>
                            </>
                          )}
                          <RegisterServiceWorker />
                    {children}
                  </body>
          </html>
        );
}
