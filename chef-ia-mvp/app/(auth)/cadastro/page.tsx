"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export default function CadastroPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [negocio, setNegocio] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null); const [mensagem, setMensagem] = useState("");

  async function criarConta(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: { data: { nome, nome_negocio: negocio } },
    });

    if (error) {
      setCarregando(false);
      setErro(error.message === "User already registered" ? "Este e-mail já está cadastrado." : "Não foi possível criar sua conta. Tente novamente.");
      return;
    }

    // O perfil (tabela `profiles`) deve ser criado automaticamente por um
    // trigger no Supabase (on auth.users insert) ou aqui, inserindo com o
    // user.id retornado — ver `supabase/migrations/0001_init.sql`.
    if (data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        nome,
        nome_negocio: negocio,
        plano: "gratuito",
        fundador: false,
      });
    }

    setMensagem("Conta criada! Preparando seu teste grátis de 15 dias..."); await new Promise((resolve) => setTimeout(resolve, 1200)); try {
      const resposta = await fetch("/api/checkout", { method: "POST" });
      const dados = await resposta.json();
      if (dados?.url) {
        window.location.href = dados.url;
        return;
      }
    } catch {
      // segue para o fallback abaixo
    }

    setCarregando(false);
    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-6 dark:bg-cacau">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-display text-3xl italic text-framboesa">Chef IA</p>
          <p className="mt-1 text-sm text-cacau/60 dark:text-cream/60">Crie sua conta gratuita</p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={criarConta}>
          <div>
            <Label htmlFor="nome">Seu nome</Label>
            <Input id="nome" required value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ana Silva" />
          </div>
          <div>
            <Label htmlFor="negocio">Nome do seu negócio</Label>
            <Input id="negocio" required value={negocio} onChange={(e) => setNegocio(e.target.value)} placeholder="Doces da Ana" />
          </div>
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com" />
          </div>
          <div>
            <Label htmlFor="senha">Senha</Label>
            <Input id="senha" type="password" required minLength={6} value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="••••••••" />
          </div>
          {erro && <p className="text-sm text-framboesa">{erro}</p>}
          <Button className="w-full" type="submit" disabled={carregando}>
            {mensagem ? mensagem : carregando ? "Criando conta..." : "Criar conta grátis"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-cacau/60 dark:text-cream/60">
          Já tem conta?{" "}
          <Link href="/login" className="font-medium text-framboesa">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
