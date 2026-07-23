"use client";

import { useState } from "react";
import { KeyRound } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export default function ContaPage() {
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(
    null
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMensagem(null);

    if (novaSenha.length < 6) {
      setMensagem({ tipo: "erro", texto: "A senha deve ter pelo menos 6 caracteres." });
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setMensagem({ tipo: "erro", texto: "As senhas não coincidem." });
      return;
    }

    setCarregando(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: novaSenha });
    setCarregando(false);

    if (error) {
      setMensagem({ tipo: "erro", texto: "Não foi possível alterar a senha. Tente novamente." });
      return;
    }

    setMensagem({ tipo: "sucesso", texto: "Senha alterada com sucesso!" });
    setNovaSenha("");
    setConfirmarSenha("");
  }

  return (
    <div className="mx-auto max-w-xl p-6">
      <div className="mb-6 flex items-center gap-3">
        <KeyRound className="h-6 w-6 text-cacau" />
        <h1 className="text-2xl font-semibold text-cacau">Minha conta</h1>
      </div>

      <Card>
        <h2 className="mb-4 text-lg font-medium text-cacau">Alterar senha</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm text-cacau/70" htmlFor="nova-senha">
              Nova senha
            </label>
            <Input
              id="nova-senha"
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              placeholder="Digite a nova senha"
              autoComplete="new-password"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-cacau/70" htmlFor="confirmar-senha">
              Confirmar nova senha
            </label>
            <Input
              id="confirmar-senha"
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              placeholder="Repita a nova senha"
              autoComplete="new-password"
              required
            />
          </div>

          {mensagem && (
            <p
              className={
                mensagem.tipo === "sucesso"
                  ? "text-sm text-pistache"
                  : "text-sm text-framboesa"
              }
            >
              {mensagem.texto}
            </p>
          )}

          <Button type="submit" variant="primary" disabled={carregando}>
            {carregando ? "Salvando..." : "Salvar nova senha"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
