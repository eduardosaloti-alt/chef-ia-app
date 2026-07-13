"use client";
import { createElement as h } from "react";
import { useEffect, useState, type ChangeEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input, Label } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
interface Pergunta { pergunta: string; ajuda: string; opcoes: string[]; }
const perguntas: Pergunta[] = [
  { pergunta: "Qual dessas frases combina mais com voce hoje?", ajuda: "Sem certo ou errado, e so pra a gente entender o momento do seu negocio.", opcoes: ["Ainda nao vendo, mas quero comecar", "Vendo por encomenda pra amigos e familia", "Ja tenho clientes fixos, mas sem organizacao", "Tenho um fluxo grande de pedidos e preciso profissionalizar"] },
  { pergunta: "Qual e o seu maior desafio na confeitaria hoje?", ajuda: "Essa e a dor que mais aparece entre confeiteiras, vamos usar isso no seu diagnostico.", opcoes: ["Nao sei quanto cobrar pelos meus doces", "Perco prazos porque nao tenho agenda organizada", "Nao sei se estou tendo lucro de verdade no fim do mes", "Uso papel ou planilha e ja nao da mais conta"] },
  { pergunta: "Com que frequencia voce vende doces?", ajuda: "Isso ajuda a entender o tamanho do seu negocio hoje.", opcoes: ["So em datas especiais", "Toda semana", "Quase todos os dias", "E meu negocio principal, em tempo integral"] },
  { pergunta: "Hoje voce controla pedidos, precos e contas com o que?", ajuda: "Quanto mais manual, mais tempo e dinheiro escapam sem voce perceber.", opcoes: ["So de cabeca, sem anotar em lugar nenhum", "Caderno ou agenda de papel", "Planilha, tipo Excel ou Google Sheets", "Ja uso algum aplicativo, mas nao e feito pra confeitaria"] },
  { pergunta: "Uma calculadora que mostra o preco certo de cada doce em segundos mudaria seu negocio?", ajuda: "", opcoes: ["Sim, com certeza", "Ajudaria bastante", "Talvez ajude um pouco"] },
  { pergunta: "Quanto tempo por semana voce perde organizando pedidos, precos e contas manualmente?", ajuda: "", opcoes: ["Menos de 1 hora", "De 1 a 3 horas", "Mais de 3 horas", "Nem sei dizer, e uma bagunca"] },
  ];
type Fase = "intro" | "perguntas" | "contato" | "calculando" | "resultado";
export function QuizFunil() {
  const [fase, setFase] = useState<Fase>("intro");
  const [passo, setPasso] = useState(0);
  const [respostas, setRespostas] = useState<string[]>([]);
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [enviando, setEnviando] = useState(false);
  const total = perguntas.length;
  useEffect(() => { if (fase !== "calculando") return; const t = setTimeout(() => setFase("resultado"), 1800); return () => clearTimeout(t); }, [fase]);
  function escolher(opcao: string) { const novas = [...respostas.slice(0, passo), opcao]; setRespostas(novas); if (passo + 1 >= total) { setFase("contato"); } else { setPasso(passo + 1); } }
  function voltar() { if (passo === 0) { setFase("intro"); return; } setPasso(passo - 1); }
  async function enviarContato() { if (!nome.trim() || !whatsapp.trim()) return; setEnviando(true); try { const supabase = createClient(); const respostasObj: Record<string, string> = {}; perguntas.forEach((p, i) => { respostasObj[p.pergunta] = respostas[i] || ""; }); await supabase.from("quiz_leads").insert({ nome: nome.trim(), whatsapp: whatsapp.trim(), respostas: respostasObj, segmento: respostas[0] || null }); } catch (err) { console.error("Nao foi possivel salvar o lead do quiz", err); } finally { setEnviando(false); setFase("calculando"); } }
  const desafio = respostas[1];
  const ferramenta = respostas[3];
  const tempoPerdido = respostas[5];
  const progresso = fase === "perguntas" ? Math.round(((passo + 1) / (total + 2)) * 100) : fase === "contato" ? Math.round(((total + 1) / (total + 2)) * 100) : fase === "calculando" || fase === "resultado" ? 100 : 0;
  const progressoStyle = { width: progresso + "%" };
  const primeiroNome = nome.trim().split(" ")[0];
  const resultadoTitulo = nome ? primeiroNome + ", o Chef IA foi feito pra isso" : "O Chef IA foi feito pra resolver exatamente isso";
  const resultadoTexto = desafio ? 'Voce disse que o maior desafio hoje e: "' + desafio + '". ' + (ferramenta ? 'Hoje voce ainda controla tudo com "' + ferramenta.toLowerCase() + '". ' : '') + (tempoPerdido ? 'E perde ' + tempoPerdido.toLowerCase() + ' por semana com isso. ' : '') + 'Com o Chef IA voce precifica certo, organiza seus pedidos e sua agenda, e enxerga o fluxo de caixa real do seu negocio, tudo em um so lugar.' : 'Com o Chef IA voce precifica certo, organiza seus pedidos e sua agenda, e enxerga o fluxo de caixa real do seu negocio, tudo em um so lugar.';
  return h("div", { className: "mx-auto max-w-xl px-6 py-12" },
           fase !== "intro" && h("div", { className: "mb-8" }, h("div", { className: "h-2 w-full overflow-hidden rounded-full bg-cacau/10 dark:bg-cream/10" }, h("div", { className: "h-full rounded-full bg-framboesa transition-all duration-300", style: progressoStyle })), fase === "perguntas" && h("p", { className: "mt-2 text-xs text-cacau/50 dark:text-cream/50" }, "Pergunta ", passo + 1, " de ", total)),
           fase === "intro" && h(Card, { className: "text-center" }, h(Badge, { tone: "dourado", className: "mb-4" }, "Teste rapido, leva 1 minuto"), h("h1", { className: "mb-3 font-display text-2xl" }, "Descubra se voce esta precificando certo (e por que seu caixa nunca fecha)"), h("p", { className: "mb-6 text-sm text-cacau/70 dark:text-cream/70" }, "Responda ", total, " perguntas rapidas sobre a sua confeitaria e receba um diagnostico personalizado na tela, sem compromisso."), h("div", { className: "mb-6 flex flex-col gap-2 text-left text-sm text-cacau/70 dark:text-cream/70" }, h("div", null, "Vamos entender como voce precifica hoje"), h("div", null, "E como esta a organizacao dos seus pedidos e da sua agenda"), h("div", null, "Pra te mostrar exatamente onde o Chef IA pode ajudar")), h(Button, { className: "w-full", onClick: () => setFase("perguntas") }, "Comecar teste gratis")),
           fase === "perguntas" && h(Card, null, h("h2", { className: "mb-2 font-display text-2xl" }, perguntas[passo].pergunta), perguntas[passo].ajuda && h("p", { className: "mb-6 text-xs text-cacau/50 dark:text-cream/50" }, perguntas[passo].ajuda), h("div", { className: "flex flex-col gap-3" }, perguntas[passo].opcoes.map((opcao) => h("button", { key: opcao, onClick: () => escolher(opcao), className: "rounded-2xl border border-cacau/10 bg-white/60 px-4 py-3 text-left text-sm transition-all duration-150 hover:border-framboesa hover:bg-framboesa/5 dark:border-cream/10 dark:bg-cacau-soft/40 dark:hover:bg-framboesa/10" }, opcao))), passo > 0 && h("button", { onClick: voltar, className: "mt-6 text-xs text-cacau/50 hover:underline dark:text-cream/50" }, "Voltar")),
           fase === "contato" && h(Card, null, h("h2", { className: "mb-2 font-display text-2xl" }, "Falta pouco! Pra onde enviamos seu diagnostico?"), h("p", { className: "mb-6 text-sm text-cacau/70 dark:text-cream/70" }, "Assim voce ve na tela o resultado personalizado e a condicao de fundadora, e a gente consegue te ajudar por WhatsApp se precisar."), h("div", { className: "mb-4" }, h(Label, { htmlFor: "quiz-nome" }, "Seu nome"), h(Input, { id: "quiz-nome", value: nome, onChange: (e: ChangeEvent<HTMLInputElement>) => setNome(e.target.value), placeholder: "Como podemos te chamar?" })), h("div", { className: "mb-6" }, h(Label, { htmlFor: "quiz-whatsapp" }, "Seu WhatsApp"), h(Input, { id: "quiz-whatsapp", value: whatsapp, onChange: (e: ChangeEvent<HTMLInputElement>) => setWhatsapp(e.target.value), placeholder: "(DDD) 90000-0000", inputMode: "tel" })), h(Button, { className: "w-full", onClick: enviarContato, disabled: enviando || !nome.trim() || !whatsapp.trim() }, enviando ? "Enviando..." : "Ver meu resultado"), h("button", { onClick: voltar, className: "mt-6 text-xs text-cacau/50 hover:underline dark:text-cream/50" }, "Voltar")),
           fase === "calculando" && h(Card, { className: "text-center" }, h("div", { className: "mx-auto mb-6 h-10 w-10 animate-spin rounded-full border-2 border-cacau/15 border-t-framboesa" }), h("h2", { className: "mb-2 font-display text-xl" }, "Calculando o diagnostico do seu negocio..."), h("p", { className: "text-sm text-cacau/60 dark:text-cream/60" }, "Ja estamos quase la.")),
           fase === "resultado" && h(Card, { className: "text-center" }, h(Badge, { tone: "dourado", className: "mb-4" }, "Seu resultado"), h("h2", { className: "mb-3 font-display text-2xl" }, resultadoTitulo), h("p", { className: "mb-4 text-sm text-cacau/70 dark:text-cream/70" }, resultadoTexto), h("p", { className: "mb-6 rounded-xl bg-dourado/10 px-4 py-3 text-xs text-cacau/70 dark:text-cream/70" }, "Restam vagas de fundadora: R$ 19,90 por mes para sempre. Teste gratis por 15 dias, sem cartao de credito."), h(Link, { href: "/cadastro" }, h(Button, { className: "w-full" }, "Quero garantir minha vaga de fundadora")))
           );
}
