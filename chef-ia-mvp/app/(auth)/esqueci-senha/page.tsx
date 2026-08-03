"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export default function EsqueciSenhaPage() {
    const [email, setEmail] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [mensagem, setMensagem] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setMensagem(null);
        setCarregando(true);
        const supabase = createClient();
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/callback?next=/redefinir-senha`,
        });
        setCarregando(false);

      if (error) {
              setMensagem({ tipo: "erro", texto: "Nao foi possivel enviar o e-mail. Tente novamente." });
              return;
      }

      setMensagem({
              tipo: "sucesso",
              texto: "Se este e-mail estiver cadastrado, voce vai receber um link para redefinir a senha.",
      });
        setEmail("");
  }

  return (
        <div className="flex min-h-screen items-center justify-center bg-cream px-6 dark:bg-cacau">
              <div className="w-full max-w-sm">
                      <div className="mb-8 text-center">
                                <p className="font-display text-3xl italic text-framboesa">Chef IA</p>
                                <p className="mt-1 text-sm text-cacau/60 dark:text-cream/60">Recuperar senha</p>
                      </div>
              
                      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                                <div>
                                            <Label htmlFor="email">E-mail</Label>
                                            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com" />
                                </div>
                      
                        {mensagem && (
                      <p className={mensagem.tipo === "erro" ? "text-sm text-framboesa" : "text-sm text-cacau/80 dark:text-cream/80"}>
                        {mensagem.texto}
                      </p>
                                )}
                      
                                <Button className="w-full" type="submit" disabled={carregando}>
                                  {carregando ? "Enviando..." : "Enviar link de recuperacao"}
                                </Button>
                      </form>
              
                      <p className="mt-6 text-center text-sm text-cacau/60 dark:text-cream/60">
                                <Link href="/login" className="font-medium text-framboesa">Voltar para o login</Link>
                      </p>
              </div>
        </div>
      );
}
</div>
