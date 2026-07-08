# Chef IA
### A inteligência artificial da confeitaria.
**Documento de Planejamento Estratégico — Etapa 1**
*Preparado como CTO / PM / UX-UI / Arquiteto de Software*

---

## Sumário

1. [Pesquisa de Mercado](#1-pesquisa-de-mercado)
2. [Análise de Concorrentes](#2-análise-de-concorrentes)
3. [Oportunidades](#3-oportunidades)
4. [Definição do MVP](#4-definição-do-mvp)
5. [Roadmap de 12 Meses](#5-roadmap-de-12-meses)
6. [Arquitetura Completa](#6-arquitetura-completa)
7. [Banco de Dados](#7-banco-de-dados)
8. [Fluxo do Usuário](#8-fluxo-do-usuário)
9. [Wireframes das Telas](#9-wireframes-das-telas)
10. [Jornada do Usuário](#10-jornada-do-usuário)
11. [Estratégia de Monetização](#11-estratégia-de-monetização)
12. [Estratégia de Lançamento](#12-estratégia-de-lançamento)
13. [Estratégia para os Primeiros 1.000 Assinantes](#13-estratégia-para-os-primeiros-1000-assinantes)
14. [Lista de Melhorias Futuras](#14-lista-de-melhorias-futuras)
15. [Cronograma Completo de Desenvolvimento](#15-cronograma-completo-de-desenvolvimento)

---

## 1. Pesquisa de Mercado

### O setor
A confeitaria artesanal e por encomenda é um dos segmentos mais pulverizados do empreendedorismo feminino no Brasil. A grande maioria das confeiteiras:

- É **MEI ou informal**, opera de casa, e vende por encomenda via WhatsApp e Instagram.
- **Não separa** dinheiro pessoal do dinheiro do negócio.
- **Precifica no "achismo"** — soma o custo dos ingredientes e aplica uma margem intuitiva, sem considerar mão de obra, custos fixos (gás, luz, embalagem, depreciação de equipamento) ou impostos.
- Usa **planilhas, cadernos ou nada** para controlar pedidos e clientes.
- Tem pouquíssimo tempo — cozinha, atende cliente, entrega e ainda cuida das redes sociais sozinha.

### Tamanho e comportamento do mercado
- O Brasil é um dos maiores consumidores de doces e bolos por encomenda do mundo, com forte cultura de festas (aniversário infantil, casamento, confraternizações, Páscoa, Natal).
- Este público é majoritariamente feminino, entre 25–45 anos, presente fortemente em comunidades no Instagram, TikTok, grupos de Facebook e WhatsApp voltados a "confeitaria lucrativa", "precificação de bolos" etc.
- Sazonalidade forte: Páscoa (ovos), Junho/Julho (festas juninas), Outubro–Dezembro (Natal, panetones, festas de fim de ano) e datas de aniversário/casamento ao longo do ano.

### A dor central
A dor #1 do setor, confirmada pelos próprios concorrentes (todos vendem em cima disso), é: **"eu vendo muito, mas no fim do mês não sobra dinheiro"** — ou seja, falta de precificação correta e de visão financeira real.

A dor #2 é **desorganização operacional**: perder prazos de entrega, esquecer pedidos, não ter histórico de clientes.

A dor #3, ainda pouco explorada pelos concorrentes, é **marketing** — a confeiteira não sabe o que postar, não tem tempo de criar conteúdo, e depende de "make" de fotos improvisadas.

---

## 2. Análise de Concorrentes

| Concorrente | Modelo | Preço aprox. | Pontos fortes | Pontos fracos |
|---|---|---|---|---|
| **ZupConfeitaria** | SaaS assinatura | Não divulgado publicamente | App + web, precificação com margem de contribuição, estoque, receitas | Visual datado, sem IA, sem marketing |
| **Calcularte** | SaaS assinatura | R$49,90/mês, R$229,90/semestre, R$289,90/ano | Pioneiro (2015), leque amplo (não só confeitaria), pagamento via PIX/boleto | Genérico (atende qualquer artesanato, não é 100% focado em confeitaria), sem IA |
| **Minha Confeitaria** | SaaS com trial | Trial 14 dias, depois plano gratuito ou pago | Atualização automática de custo de receita pelo preço do ingrediente | Posicionamento pouco premium, comunicação simples |
| **Viver de Confeitaria / Gestly** | App + SaaS | Freemium (1 receita grátis) + Premium | Orçamento via WhatsApp, dashboard, fichas técnicas | Limite agressivo no free (1 receita), sem estoque robusto |
| **Maya** | SaaS web only | Assinatura | "Aprende" com o uso para sugerir preços, sem app (só navegador) | Não emite nota fiscal, não tem app mobile nativo |
| **Confeitaria Pro** | Pagamento único (R$67) | Pagamento único, não recorrente | Foco em confeiteiras no exterior, cardápio digital com link de pedido via WhatsApp | Modelo de pagamento único limita receita recorrente e evolução contínua do produto |
| **Lucro na Confeitaria** | App mobile | Freemium/pago | Foco simples em precificação e faturamento | Reviews recentes reportam bugs, lentidão e falhas ao salvar pedidos/receitas |

### Conclusão da análise
Nenhum concorrente hoje entrega:
- **IA generativa real** (todos fazem apenas "cálculo automático", não geração de conteúdo, legendas, receitas ou sugestões estratégicas com linguagem natural).
- **Design premium** — todos têm interfaces funcionais, mas nenhuma remete a Stripe/Notion/Linear.
- **Onboarding com Google Login** fácil e experiência mobile-first fluida.
- **Modelo de fundador vitalício** (preço trancado para os primeiros assinantes) como alavanca de aquisição.

---

## 3. Oportunidades

1. **IA como diferencial central, não feature secundária** — a Chef IA não é "mais um app de precificação com um chatbot"; é uma assistente completa de negócios de confeitaria.
2. **Design de categoria própria** — ser o "Notion da confeitaria": bonito, rápido, simples — algo que nenhum concorrente entrega hoje.
3. **Marketing IA** — nenhum concorrente ajuda a criar legendas, roteiros de vídeo e calendário de conteúdo. Essa é a maior lacuna competitiva e a que gera maior percepção de valor para redes sociais (o principal canal de vendas dessas confeiteiras).
4. **Modelo freemium bem calibrado** — concorrentes ou são muito restritivos no grátis (1 receita) ou não têm grátis. Um free generoso o bastante para criar hábito, mas limitado o bastante para converter, é uma oportunidade real.
5. **Comunidade + conteúdo** — criar uma comunidade ativa (grupo fechado, conteúdo educativo sobre precificação) gera aquisição orgânica muito barata nesse nicho, como o Calcularte já demonstra fazer bem.
6. **Pagamento via PIX nativo** — reduz fricção de conversão, essencial nesse público.

---

## 4. Definição do MVP

O MVP deve validar a hipótese central: **"confeiteiras pagam por uma ferramenta bonita e simples que resolve precificação, agenda e fluxo de caixa, com um toque de IA."**

| Módulo | Escopo no MVP |
|---|---|
| **Login Google** | OAuth2 via Google, um clique |
| **Login E-mail** | Cadastro com e-mail/senha + verificação |
| **Dashboard** | Visão geral: próximos pedidos, faturamento do mês, alertas de entrega, lucro estimado |
| **Cadastro de Clientes** | Nome, contato, WhatsApp, aniversário, histórico de pedidos |
| **Agenda de Pedidos** | Calendário visual (mês/semana) com pedidos e datas de entrega |
| **Cadastro de Pedidos** | Produto, cliente, valor, data de entrega, status (novo/produção/entregue/pago) |
| **Calculadora Inteligente de Precificação** | Insumos + mão de obra + custos fixos + margem desejada → preço sugerido pela IA, com explicação em linguagem simples |
| **Fluxo de Caixa** | Entradas e saídas, saldo do mês, gráfico simples de evolução |
| **Área do Assinante** | Gestão de plano, upgrade/downgrade, forma de pagamento, cancelamento |
| **Painel Administrativo** | (uso interno) métricas de usuários, assinaturas ativas, churn, MRR |

**Fora do MVP** (mas arquitetado para expansão): estoque, receitas, IA de marketing, notificações WhatsApp, PIX nativo, apps nativos.

---

## 5. Roadmap de 12 Meses

| Trimestre | Foco | Entregas |
|---|---|---|
| **T1 (Mês 1–3)** | Validação | MVP completo (lista acima) + lançamento beta fechado + primeiros 100 fundadores (R$19,90 vitalício) |
| **T2 (Mês 4–6)** | Retenção e produto core | Controle de estoque, Lista de compras, Receitas, notificações por e-mail, melhorias de UX baseadas em feedback |
| **T3 (Mês 7–9)** | IA de marketing (grande diferencial) | Assistente IA de chat, Gerador de legendas, Gerador de Stories/Reels (roteiro), Calendário de conteúdo |
| **T4 (Mês 10–12)** | Escala e monetização avançada | Financeiro completo, Relatórios/Indicadores/Metas, WhatsApp, PIX nativo, Mercado Pago, exportação em PDF, apps Android/iOS (wrapper ou nativo) |

---

## 6. Arquitetura Completa

### Princípio guia
Como pedido, priorizamos **camada gratuita** em cada peça da stack, mantendo caminho claro de upgrade pago conforme a base de usuários cresce — sem precisar reescrever nada.

| Camada | Tecnologia | Por quê |
|---|---|---|
| **Frontend** | Next.js 14+ (React, App Router) + TypeScript + Tailwind CSS + shadcn/ui + Framer Motion | Melhor DX do mercado, SSR/SEO nativo (importante para landing page e SEO orgânico), performance, e é o que Vercel/Linear/Cursor usam. Tailwind + shadcn permite o visual "premium" (Stripe/Notion/Linear) rapidamente. Framer Motion cobre as animações suaves pedidas. |
| **Backend** | Supabase (Postgres + Auth + Storage + Edge Functions) | Plano gratuito generoso (500MB DB, 50k usuários autenticados/mês, 1GB storage), Auth com Google já pronto, Row Level Security nativo (segurança de dados por usuário), Postgres real (não vendor lock-in exótico) e escala para pago sem migração quando crescer. |
| **Banco de Dados** | PostgreSQL (via Supabase) | Relacional, robusto, suporta as relações complexas de pedidos/clientes/financeiro, com extensões (ex. `pgvector` futuramente para IA). |
| **Autenticação** | Supabase Auth (Google OAuth + e-mail/senha) | Gratuito, seguro, JWT nativo, já integrado ao Postgres via RLS. |
| **Hospedagem (Frontend)** | Vercel (plano Hobby gratuito no início) | Deploy automático a cada push, CDN global, preview de cada PR, integração nativa com Next.js. |
| **IA** | API Anthropic (Claude) — modelo Sonnet para geração de texto/precificação, com prompts especializados por função (precificação, receitas, legendas, roteiros) | Melhor custo-benefício e qualidade de raciocínio para tarefas de negócio e criação de conteúdo em português. |
| **Pagamentos** | Stripe (assinatura recorrente internacional-ready) + Mercado Pago (PIX/boleto, fase 2) | Stripe é robusto, tem trial nativo, fácil de integrar com "preço trancado" por usuário (via customer-specific pricing/coupons). Mercado Pago entra na fase 2 para cobrir PIX nativo, essencial no Brasil. |
| **Monitoramento** | Vercel Analytics (grátis) + Sentry (plano free) | Erros de frontend/backend capturados sem custo inicial. |
| **CI/CD** | GitHub Actions + deploy automático via Vercel | Gratuito para repositórios (limite generoso de minutos), testes automatizados antes de cada deploy. |
| **E-mail transacional** | Resend (plano free até 3.000 e-mails/mês) | Confirmação de cadastro, recuperação de senha, notificações. |

### Segurança
- Row Level Security (RLS) no Postgres: cada confeiteira só acessa seus próprios dados.
- Senhas nunca armazenadas em texto puro (gerenciado pelo Supabase Auth).
- HTTPS obrigatório (nativo na Vercel).
- Variáveis sensíveis (chaves de API) nunca expostas no frontend.

### Escalabilidade
- Arquitetura *serverless* desde o dia 1 (Next.js + Supabase + Vercel) → escala automaticamente sem gestão de servidores.
- Separação clara entre camada de dados (Postgres/RLS), lógica de negócio (Edge Functions/API Routes) e apresentação (componentes React) — facilita adicionar mobile nativo depois reaproveitando a mesma API.

### Estrutura de pastas (proposta)
```
chef-ia/
├── app/                    # Next.js App Router
│   ├── (marketing)/        # Landing page, preços, blog
│   ├── (auth)/             # Login, cadastro
│   ├── (app)/              # Dashboard, pedidos, clientes, caixa...
│   └── (admin)/            # Painel administrativo
├── components/
│   ├── ui/                 # shadcn/ui base
│   └── features/           # componentes por domínio (pedidos, clientes...)
├── lib/
│   ├── supabase/           # client, server, middleware
│   ├── ai/                 # prompts e chamadas à API de IA
│   └── utils/
├── types/                  # tipos TypeScript (gerados do schema do Supabase)
├── supabase/
│   ├── migrations/
│   └── seed.sql
└── PROJECT.md
```

### APIs internas (exemplos)
- `POST /api/precificacao` — recebe insumos/custos, retorna preço sugerido + explicação da IA.
- `POST /api/pedidos` / `GET /api/pedidos` — CRUD de pedidos.
- `POST /api/webhooks/stripe` — eventos de assinatura (ativação, cancelamento, falha de pagamento).

---

## 7. Banco de Dados

```sql
-- Usuários (gerenciado pelo Supabase Auth, estendido aqui)
create table profiles (
  id uuid primary key references auth.users(id),
  nome text,
  nome_negocio text,
  telefone text,
  plano text default 'gratuito', -- gratuito | pro | premium
  preco_travado numeric,          -- ex: 19.90 para os 100 fundadores
  fundador boolean default false,
  criado_em timestamptz default now()
);

-- Clientes
create table clientes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  nome text not null,
  whatsapp text,
  aniversario date,
  observacoes text,
  criado_em timestamptz default now()
);

-- Produtos (bolos, doces, brigadeiros etc.)
create table produtos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  nome text not null,
  categoria text, -- bolo, doce, brigadeiro, brownie, cookie, ovo de páscoa...
  custo_ingredientes numeric,
  custo_mao_de_obra numeric,
  custo_fixo_rateado numeric,
  margem_desejada numeric,
  preco_sugerido numeric,
  criado_em timestamptz default now()
);

-- Pedidos
create table pedidos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  cliente_id uuid references clientes(id),
  produto_descricao text,
  valor numeric,
  data_entrega timestamptz,
  status text default 'novo', -- novo | producao | entregue | pago | cancelado
  criado_em timestamptz default now()
);

-- Fluxo de Caixa
create table transacoes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  tipo text, -- entrada | saida
  categoria text,
  descricao text,
  valor numeric,
  data date,
  criado_em timestamptz default now()
);

-- Assinaturas (espelho do Stripe/Mercado Pago)
create table assinaturas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  provedor text, -- stripe | mercadopago
  status text,   -- ativa | cancelada | inadimplente
  plano text,
  valor numeric,
  proxima_cobranca timestamptz
);
```

Todas as tabelas com `user_id` recebem política de **Row Level Security**: `user_id = auth.uid()`.

---

## 8. Fluxo do Usuário

```
Descoberta (Instagram/TikTok/indicação)
        │
        ▼
Landing Page (proposta de valor + prova social)
        │
        ▼
Cadastro (Google ou e-mail) ──► Onboarding rápido (nome do negócio, o que vende)
        │
        ▼
Dashboard vazio com CTA: "Cadastre seu primeiro produto"
        │
        ▼
Calculadora de Precificação (primeiro "aha moment")
        │
        ▼
Cadastro de Cliente + Pedido
        │
        ▼
Uso recorrente: Agenda + Fluxo de Caixa
        │
        ▼
Limite do plano gratuito atingido ──► Upgrade para Pro/Premium
```

---

## 9. Wireframes das Telas

*(Descrição estrutural de cada tela principal do MVP — layout mobile-first, com versão desktop expandida em colunas)*

**Login / Cadastro**
- Logo Chef IA centralizado, botão "Entrar com Google" em destaque, e opção secundária "Entrar com e-mail". Fundo com gradiente suave (paleta rosa/creme/dourado, remetendo à confeitaria, mas com sofisticação tipo Stripe).

**Dashboard**
- Topo: saudação ("Boa tarde, Ana 👋") + resumo do dia (pedidos para hoje).
- Cards em grid: Faturamento do mês, Lucro estimado, Próxima entrega, Pedidos em produção.
- Abaixo: lista dos 5 próximos pedidos com status colorido.

**Agenda de Pedidos**
- Toggle mês/semana no topo.
- Calendário com pontos indicando dias com entrega.
- Ao clicar no dia, abre lateral (desktop) ou modal (mobile) com os pedidos daquele dia.

**Cadastro de Pedido**
- Formulário em etapas curtas: 1) Cliente (buscar ou criar novo) 2) Produto/descrição 3) Valor e data de entrega 4) Confirmar.

**Calculadora de Precificação**
- Inputs: ingredientes (nome + custo), horas de trabalho, custo fixo mensal e quantidade produzida, margem desejada.
- Resultado em destaque: "Preço sugerido: R$ 85,00" com explicação da IA em linguagem simples logo abaixo ("Esse valor garante 40% de margem depois de cobrir seus custos e sua hora de trabalho.").

**Fluxo de Caixa**
- Gráfico de linha simples (entradas vs. saídas no mês).
- Lista de transações abaixo, com filtro por categoria.

**Área do Assinante**
- Cartão do plano atual, com badge "Fundador — R$19,90 para sempre" quando aplicável.
- Botão de upgrade, histórico de faturas, forma de pagamento.

**Painel Administrativo** (uso interno da equipe Chef IA)
- Métricas: MRR, número de assinantes ativos por plano, churn mensal, novos cadastros por dia.

---

## 10. Jornada do Usuário

| Estágio | O que a confeiteira sente | O que o Chef IA entrega |
|---|---|---|
| **Descoberta** | "Preciso parar de vender no prejuízo" | Conteúdo educativo (Instagram/TikTok) sobre precificação correta |
| **Ativação** | "Nossa, é bonito e fácil" | Onboarding em menos de 2 minutos, primeiro cálculo de preço em segundos |
| **Hábito** | "Isso já virou parte da minha rotina" | Uso diário: agenda, pedidos, caixa |
| **Conversão** | "Vale a pena pagar por isso" | Limite do free bem calibrado + oferta de fundador (R$19,90 vitalício) |
| **Retenção** | "Não consigo mais trabalhar sem isso" | IA de marketing (T3), relatórios que mostram evolução real do negócio |
| **Advocacia** | "Preciso indicar pra minhas amigas confeiteiras" | Programa de indicação, comunidade ativa |

---

## 11. Estratégia de Monetização

### Planos
| Plano | Preço | Público |
|---|---|---|
| **Gratuito** | R$0 | Testar o produto, limite de pedidos/clientes cadastrados |
| **Fundador (Pro)** | **R$19,90/mês — travado para sempre**, exclusivo para os **primeiros 100 assinantes** | Early adopters, geram prova social e feedback |
| **Pro** | R$39,90/mês (preço padrão após esgotar as 100 vagas de fundador) | Confeiteira estabelecida, uso completo do MVP |
| **Premium** | A definir na fase 2 (quando a IA de marketing entrar) — sugestão inicial R$69,90–79,90/mês | Quem quer também o motor de marketing com IA |

### Sobre o preço de fundador
- É uma âncora de aquisição poderosa: cria urgência real ("restam X vagas"), gera boca a boca, e recompensa quem confiou no produto ainda cru.
- Tecnicamente: implementar como um campo `fundador = true` + `preco_travado = 19.90` no perfil do usuário, aplicado via cupom/preço fixo no Stripe, **imune a reajustes futuros de plano Pro**, mas ainda sujeito a ganhar acesso a novas features do mesmo plano.
- Recomendação: deixe claro nos termos que o preço trancado vale para o plano nesse nível de funcionalidades — se no futuro o Premium tiver features muito além do Pro, o fundador paga o valor do Premium normalmente caso queira migrar (isso evita ter que dar todo recurso futuro de graça para sempre).

### Pagamento
- Cartão de crédito recorrente (Stripe) desde o MVP.
- PIX via Mercado Pago entra no roadmap (T4) — ponto de atenção pois é o meio de pagamento preferido desse público.

---

## 12. Estratégia de Lançamento

1. **Pré-lançamento (4 semanas antes)**: landing page com waitlist + conteúdo educativo nas redes (Instagram/TikTok) sobre "os erros mais comuns de precificação".
2. **Beta fechado**: convidar 30–50 confeiteiras da waitlist para testar antes do público, coletar feedback intenso, corrigir bugs críticos.
3. **Lançamento oficial das 100 vagas de fundador**: campanha de urgência ("apenas 100 vagas com preço vitalício de R$19,90"), contador público de vagas restantes.
4. **Pós-lançamento**: depoimentos em vídeo das primeiras usuárias, cases reais de "quanto ela estava perdendo antes vs. depois".

---

## 13. Estratégia para os Primeiros 1.000 Assinantes

1. **Comunidade fechada** (grupo de WhatsApp ou Discord/Telegram) para as fundadoras — gera pertencimento e feedback direto.
2. **Parcerias com micro-influenciadoras de confeitaria** (10k–100k seguidores) trocando acesso Premium gratuito por divulgação genuína.
3. **Conteúdo educativo consistente** (Reels/TikTok) ensinando precificação — o mesmo conteúdo que atrai vira prova de autoridade do produto.
4. **Programa de indicação**: cada fundadora que indicar 3 amigas que assinarem ganha 1 mês grátis.
5. **SEO e conteúdo de blog** (Next.js já suporta nativamente): artigos como "como precificar bolo de andar", "planilha de fluxo de caixa para confeitaria" — captura tráfego de busca de baixo custo.
6. **Grupos de Facebook/WhatsApp de confeiteiras já existentes**: participação genuína (não spam), oferecendo valor antes de vender.

---

## 14. Lista de Melhorias Futuras

Organizadas por categoria, priorizadas dentro de cada uma:

**Operação**
1. Controle de Estoque
2. Lista de Compras (gerada automaticamente pela IA a partir dos pedidos da semana)
3. Receitas (com custo calculado automaticamente por ingrediente)

**Inteligência Artificial**
4. Assistente IA (chat especialista em confeitaria)
5. Gerador de Legendas
6. Gerador de Stories
7. Gerador de Reels (roteiro)
8. Calendário de Conteúdo
9. Marketing IA (campanhas sazonais: Páscoa, Natal, Dia das Mães)
10. Sugestões de vendas baseadas em histórico

**Financeiro**
11. Financeiro Completo (DRE simplificado)
12. Relatórios
13. Indicadores
14. Metas

**Comunicação e pagamento**
15. Notificações (push/e-mail)
16. Integração WhatsApp (confirmação automática de pedido)
17. PIX nativo
18. Mercado Pago
19. Exportação em PDF (orçamentos, recibos)

**Infraestrutura**
20. Backup automatizado
21. Aplicativo Android nativo
22. Aplicativo iPhone nativo

---

## 15. Cronograma Completo de Desenvolvimento

| Semana | Entrega |
|---|---|
| 1 | Setup do projeto (Next.js + Supabase + Vercel + CI/CD), design system inicial (cores, tipografia, componentes base) |
| 2 | Autenticação (Google + e-mail), estrutura de banco de dados, RLS |
| 3 | Dashboard + Cadastro de Clientes |
| 4 | Agenda de Pedidos + Cadastro de Pedidos |
| 5 | Calculadora Inteligente de Precificação (integração com IA) |
| 6 | Fluxo de Caixa |
| 7 | Área do Assinante + integração Stripe (planos e preço de fundador) |
| 8 | Painel Administrativo + testes gerais, correção de bugs, polimento de UX/animações |
| 9 | Beta fechado com confeiteiras convidadas |
| 10 | Ajustes pós-feedback do beta |
| 11 | Preparação de lançamento (landing page, campanha das 100 vagas) |
| 12 | **Lançamento oficial** |

---

## Próximo Passo

Este documento cobre 100% da Etapa 1 solicitada. Nenhuma linha de código foi escrita, conforme combinado.

**Posso iniciar a implementação da Fase 2 (desenvolvimento do MVP)?**

O documento `PROJECT.md` já foi criado junto com este planejamento e será atualizado automaticamente a cada etapa do desenvolvimento a partir de agora.
