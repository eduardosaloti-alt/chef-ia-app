import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import RegisterServiceWorker from "./register-sw";

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
                          <RegisterServiceWorker />
                    {children}
                  </body>
          </html>
        );
}
