# PROJECT.md — Chef IA

> Documento vivo de acompanhamento do projeto. Atualizado automaticamente ao final de cada etapa de desenvolvimento.

**Última atualização:** 08/07/2026 — Integrações de backend conectadas

---

## 1. Já desenvolvido

**Etapa 1 — Planejamento**
- [x] Pesquisa de mercado, concorrentes, oportunidades, MVP, roadmap, arquitetura, banco de dados, wireframes, jornada, monetização, lançamento, estratégia de 1.000 assinantes, backlog futuro e cronograma (ver `CHEFIA_PLANEJAMENTO.md`).

**Fase 2 — MVP navegável (UI completa)**
- [x] Next.js 14 + TypeScript + Tailwind, design system (cores, tipografia, elemento assinatura), landing page, todas as telas do MVP com dados em memória.

**Fase 2.1 — Integrações de backend conectadas**
- [x] Autenticação real: login com Google (OAuth) e e-mail/senha chamando o Supabase Auth de verdade (`app/(auth)/login`, `app/(auth)/cadastro`)
- [x] Rota de callback do OAuth (`app/auth/callback/route.ts`)
- [x] `middleware.ts` protegendo rotas internas e o painel administrativo (com verificação de `role = admin`)
- [x] Trigger no Postgres para criar o perfil automaticamente no cadastro via Google
- [x] Camada de queries reais ao Supabase (`lib/supabase/queries.ts`), espelhando 1:1 a interface do store em memória
- [x] Checkout do Stripe (`app/api/checkout/route.ts`), já aplicando a regra das 100 vagas de fundadora
- [x] Portal de faturamento do Stripe (`app/api/checkout/portal/route.ts`)
- [x] Webhook do Stripe totalmente implementado (`app/api/webhooks/stripe/route.ts`), sincronizando assinaturas e plano do perfil
- [x] Botões de assinatura em `/assinatura` conectados de ponta a ponta ao checkout e ao portal
- [x] Botão de logout na barra lateral
- [x] Toggle de modo claro/escuro funcional, com preferência salva
- [x] Schema SQL atualizado com colunas de Stripe e trigger de criação de perfil

**Importante**: o app ainda **funciona 100% em memória** (`lib/store.tsx`) até que `.env.local` seja preenchido — nada quebra por falta de configuração. Assim que as chaves do Supabase e do Stripe forem preenchidas, basta trocar o `ChefIAProvider` pelas funções de `lib/supabase/queries.ts` para os dados passarem a ser reais.

## 2. Falta desenvolver

- [ ] Trocar efetivamente `lib/store.tsx` por `lib/supabase/queries.ts` nas telas (troca mecânica, 1:1)
- [ ] Preencher `.env.local` com as chaves reais (Supabase, Stripe, Anthropic)
- [ ] Ativar explicação da precificação via API da Anthropic (hoje é texto determinístico em `lib/ai/precificacao.ts`)
- [ ] Testes automatizados
- [ ] Deploy em produção (Vercel)
- [ ] Beta fechado com confeiteiras reais
- [ ] Contador de vagas de fundadora ao vivo na landing page (hoje é estático; a função `contar_fundadores()` já existe no banco, falta consumi-la na landing)

## 3. Decisões técnicas

Ver `CHEFIA_PLANEJAMENTO.md`, seção 6, para as justificativas de arquitetura, e a versão anterior deste arquivo (histórico do git) para decisões da Fase 2.

Novas decisões desta rodada:
| Decisão | Justificativa |
|---|---|
| `middleware.ts` "fail-open" quando o Supabase não está configurado | Garante que o MVP em memória continue 100% navegável para demonstração, sem exigir configuração prévia |
| Perfil criado por trigger no Postgres (Google) + insert direto no front (e-mail/senha) | O trigger cobre o caso do OAuth, onde não há um passo extra no front para inserir o perfil; o e-mail/senha já tem esse passo natural logo após o `signUp` |
| Webhook do Stripe usa a Service Role Key | Roda no servidor sem sessão de usuário; precisa de permissão para escrever em qualquer linha, contornando o RLS com segurança porque nunca é exposta ao navegador |
| Regra das 100 vagas resolvida no backend (`/api/checkout`), não só na UI | Evita que alguém "engane" o preço de fundadora manipulando o front-end — a validação de negócio que importa fica no servidor |

## 4. Próximos passos

1. Criar o projeto no Supabase e rodar `supabase/migrations/0001_init.sql`.
2. Criar os produtos no Stripe e preencher `.env.local`.
3. Trocar `lib/store.tsx` por `lib/supabase/queries.ts` nas telas.
4. Deploy no Vercel e testes com usuárias reais no beta fechado.

## 5. Melhorias futuras (backlog priorizado)

Ver seção 14 do `CHEFIA_PLANEJAMENTO.md`.

## 6. Bugs encontrados

_Nenhum reportado ainda._

## 7. Correções realizadas

_Nenhuma ainda._
