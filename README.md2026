# Chef IA — MVP

A inteligência artificial da confeitaria.

Este repositório contém o MVP navegável do Chef IA: landing page, autenticação (UI pronta, a conectar), dashboard, clientes, agenda, pedidos, calculadora inteligente de precificação, fluxo de caixa, área do assinante e painel administrativo.

## Estado atual

O app **funciona localmente com dados em memória** (ver `lib/store.tsx`), para que você já possa navegar por todas as telas, testar a calculadora de precificação e ver o design completo — sem precisar configurar nada ainda.

As integrações reais (Supabase, Stripe, IA) estão **preparadas e comentadas no código**, prontas para ativar quando você tiver as chaves de API.

## Como rodar localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Design

- **Cores**: creme (#FBF6F0), cacau (#3B2A24), framboesa (#B23A56 — cor primária), dourado (#C9A24B — plano fundador/premium), pistache (#7C8A5E — valores positivos).
- **Tipografia**: Fraunces (display, títulos) + Inter (interface) + JetBrains Mono (valores numéricos).
- **Elemento assinatura**: o "traço de bico de confeitar" (`components/ui/piping-divider.tsx`), usado com moderação como divisor.
- Modo claro/escuro via classe `.dark` no Tailwind (toggle ainda não construído na UI — é um `useState` + `document.documentElement.classList.toggle("dark")` de poucas linhas quando quiser adicionar).

## O que já está conectado (não é mais só mock)

- **Autenticação real**: os formulários de login e cadastro (`app/(auth)`) já chamam `supabase.auth.signInWithOAuth`, `signInWithPassword` e `signUp` de verdade — só faltam as chaves do Supabase em `.env.local`.
- **Proteção de rotas**: `middleware.ts` bloqueia `/dashboard`, `/clientes`, `/pedidos`, `/agenda`, `/calculadora`, `/caixa`, `/assinatura` e `/admin` para quem não está logado, e `/admin` também exige `role = 'admin'` no perfil. Enquanto o Supabase não estiver configurado, o middleware não bloqueia nada (para não travar o MVP em memória).
- **Callback de OAuth**: `app/auth/callback/route.ts` troca o código do Google por uma sessão válida.
- **Criação automática de perfil**: um trigger no Postgres (`supabase/migrations/0001_init.sql`) cria a linha em `profiles` assim que alguém se cadastra pelo Google; no cadastro por e-mail, o próprio front-end insere o perfil logo após o `signUp`.
- **Checkout do Stripe**: `app/api/checkout/route.ts` cria a sessão de assinatura, já aplicando a regra de negócio "se as 100 vagas de fundadora acabaram, cobra o plano Pro automaticamente".
- **Portal de faturamento**: `app/api/checkout/portal/route.ts` abre o Portal do Cliente do Stripe (trocar cartão, ver faturas, cancelar).
- **Webhook do Stripe**: `app/api/webhooks/stripe/route.ts` já sincroniza `checkout.session.completed`, `customer.subscription.updated/deleted` e `invoice.payment_failed` com as tabelas `assinaturas` e `profiles`.
- **Modo claro/escuro**: botão funcional na barra lateral (`components/features/theme-toggle.tsx`), com preferência salva.
- **Sair da conta**: botão de logout na barra lateral.
- **Camada de queries pronta**: `lib/supabase/queries.ts` espelha exatamente os métodos do `lib/store.tsx` — trocar um pelo outro é a única mudança necessária para sair do modo demonstração.

## Próximos passos para produção

### 1. Conectar o Supabase (gratuito)
1. Crie um projeto em [supabase.com](https://supabase.com).
2. Rode o SQL de `supabase/migrations/0001_init.sql` no SQL Editor do projeto.
3. Em **Authentication → Providers**, ative o login com Google.
4. Copie `.env.example` para `.env.local` e preencha `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5. Troque o `ChefIAProvider` (`lib/store.tsx`) pelas funções já prontas em `lib/supabase/queries.ts` — a interface dos métodos (`addCliente`, `addPedido`, etc.) foi desenhada para ser reimplementada sem mudar nenhuma tela.
6. Preencha também `SUPABASE_SERVICE_ROLE_KEY` (Settings → API no painel do Supabase) — é usada pelo webhook do Stripe para escrever nas tabelas sem depender de uma sessão de usuário.

### 2. Conectar o Stripe
1. Crie os produtos "Fundador" (R$19,90/mês) e "Pro" (R$39,90/mês) no painel do Stripe, e copie os respectivos Price IDs para `STRIPE_PRICE_ID_FUNDADOR` e `STRIPE_PRICE_ID_PRO`.
2. Preencha `STRIPE_SECRET_KEY` e `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` em `.env.local`.
3. Configure o webhook no painel do Stripe apontando para `/api/webhooks/stripe`, selecionando os eventos `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted` e `invoice.payment_failed`. Copie o "Signing secret" para `STRIPE_WEBHOOK_SECRET`.
4. Os botões de assinatura em `/assinatura` já chamam `/api/checkout` de verdade — assim que as chaves acima estiverem preenchidas, o fluxo completo (checkout → webhook → atualização do perfil) funciona de ponta a ponta.
5. Importante sobre o preço travado: o `STRIPE_PRICE_ID_FUNDADOR` deve parar de ser oferecido depois da 100ª assinante (o endpoint `/api/checkout` já faz essa verificação sozinho, consultando `contar_fundadores()` no banco) — quem já assinou continua pagando o mesmo valor para sempre, mesmo que você crie um Price mais caro depois.

### 3. Conectar a IA (Anthropic)
- A calculadora de precificação já tem a lógica determinística pronta (`lib/ai/precificacao.ts`) e o endpoint (`app/api/precificacao/route.ts`).
- Para ativar a explicação em linguagem natural gerada por IA (em vez do texto-modelo atual), siga o exemplo comentado dentro do próprio `route.ts`.

### 4. Deploy
- Recomendado: [Vercel](https://vercel.com) (plano gratuito), conectando este repositório diretamente do GitHub — cada push gera um deploy automático.

## Estrutura de pastas

Ver `CHEFIA_PLANEJAMENTO.md` (seção 6 — Arquitetura Completa) para a explicação completa de cada decisão técnica.

## Acompanhamento do projeto

Ver `PROJECT.md`, atualizado a cada etapa de desenvolvimento.
