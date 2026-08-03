"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export default function RedefinirSenhaPage() {
    const router = useRouter();
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [mensagem, setMensagem] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setMensagem(null);

      if (novaSenha.length < 6) {
              setMensagem({ tipo: "erro", texto: "A senha deve ter pelo menos 6 caracteres." });
              return;
      }

      if (novaSenha !== confirmarSenha) {
              setMensagem({ tipo: "erro", texto: "As senhas nao coincidem." });
              return;
      }

      setCarregando(true);
        const supabase = createClient();
        const { error } = await supabase.auth.updateUser({ password: novaSenha });
        setCarregando(false);

      if (error) {
              setMensagem({ tipo: "erro", texto: "Nao foi possivel redefinir a senha. Solicite um novo link e tente novamente." });
              return;
      }

      setMensagem({ tipo: "sucesso", texto: "Senha redefinida com sucesso! Redirecionando..." });
        setNovaSenha("");
        setConfirmarSenha("");
        setTimeout(() => router.push("/dashboard"), 1500);
  }

  return (
        <div className="flex min-h-screen items-center justify-center bg-cream px-6 dark:bg-cacau">
              <div className="w-full max-w-sm">
                      <div className="mb-8 text-center">
                                <p className="font-display text-3xl italic text-framboesa">Chef IA</p>
                                <p className="mt-1 text-sm text-cacau/60 dark:text-cream/60">Definir nova senha</p>
                      </div>
              
                      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                                <div>
                                            <Label htmlFor="nova-senha">Nova senha</Label>
                                            <Input id="nova-senha" type="password" required value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} />
                                </div>
                                <div>
                                            <Label htmlFor="confirmar-senha">Confirmar nova senha</Label>
                                            <Input id="confirmar-senha" type="password" required value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} />
                                </div>
                      
                        {mensagem && (
                      <p className={mensagem.tipo === "erro" ? "text-sm text-framboesa" : "text-sm text-cacau/80 dark:text-cream/80"}>
                        {mensagem.texto}
                      </p>
                                )}
                      
                                <Button className="w-full" type="submit" disabled={carregando}>
                                  {carregando ? "Salvando..." : "Salvar nova senha"}
                                </Button>
                      </form>
              </div>
        </div>
      );
}
