"use client";

import { useState } from "react";
import { useChefIA } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export default function ClientesPage() {
  const { clientes, addCliente } = useChefIA();
  const [aberto, setAberto] = useState(false);
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [aniversario, setAniversario] = useState("");

  function salvar() {
    if (!nome.trim()) return;
    addCliente({ nome, whatsapp, aniversario: aniversario || undefined });
    setNome("");
    setWhatsapp("");
    setAniversario("");
    setAberto(false);
  }

  return (
    <div className="animate-fade-up">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Clientes</h1>
          <p className="mt-1 text-cacau/60 dark:text-cream/60">
            {clientes.length} cliente{clientes.length !== 1 && "s"} cadastrado{clientes.length !== 1 && "s"}
          </p>
        </div>
        <Button onClick={() => setAberto((v) => !v)}>
          {aberto ? "Cancelar" : "Novo cliente"}
        </Button>
      </header>

      {aberto && (
        <Card className="mb-6 max-w-md">
          <div className="mb-4">
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Marina Alves" />
          </div>
          <div className="mb-4">
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input id="whatsapp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="(11) 90000-0000" />
          </div>
          <div className="mb-4">
            <Label htmlFor="aniversario">Aniversário (opcional)</Label>
            <Input id="aniversario" type="date" value={aniversario} onChange={(e) => setAniversario(e.target.value)} />
          </div>
          <Button onClick={salvar}>Salvar cliente</Button>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {clientes.map((c) => (
          <Card key={c.id}>
            <p className="font-medium">{c.nome}</p>
            <p className="mt-1 text-sm text-cacau/60 dark:text-cream/60">{c.whatsapp}</p>
            {c.aniversario && (
              <p className="mt-1 text-xs text-cacau/40 dark:text-cream/40">
                🎂 {new Date(c.aniversario).toLocaleDateString("pt-BR")}
              </p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
