-- Chef IA — Schema inicial
-- Rode este arquivo no SQL Editor do Supabase (ou via supabase CLI: supabase db push)

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text,
  nome_negocio text,
  telefone text,
  plano text default 'gratuito' check (plano in ('gratuito','fundador','pro','premium')),
  preco_travado numeric,
  fundador boolean default false,
  role text default 'user' check (role in ('user','admin')),
  criado_em timestamptz default now()
);

create table if not exists clientes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  nome text not null,
  whatsapp text,
  aniversario date,
  observacoes text,
  criado_em timestamptz default now()
);

create table if not exists produtos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  nome text not null,
  categoria text,
  custo_ingredientes numeric,
  custo_mao_de_obra numeric,
  custo_fixo_rateado numeric,
  margem_desejada numeric,
  preco_sugerido numeric,
  criado_em timestamptz default now()
);

create table if not exists pedidos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  cliente_id uuid references clientes(id) on delete set null,
  produto_descricao text,
  valor numeric,
  data_entrega timestamptz,
  status text default 'novo' check (status in ('novo','producao','entregue','pago','cancelado')),
  criado_em timestamptz default now()
);

create table if not exists transacoes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  tipo text check (tipo in ('entrada','saida')),
  categoria text,
  descricao text,
  valor numeric,
  data date,
  criado_em timestamptz default now()
);

create table if not exists assinaturas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  provedor text check (provedor in ('stripe','mercadopago')),
  stripe_customer_id text,
  stripe_subscription_id text,
  status text,
  plano text,
  valor numeric,
  proxima_cobranca timestamptz
);

-- Row Level Security: cada usuário só acessa seus próprios dados
alter table profiles enable row level security;
alter table clientes enable row level security;
alter table produtos enable row level security;
alter table pedidos enable row level security;
alter table transacoes enable row level security;
alter table assinaturas enable row level security;

create policy "usuário vê seu próprio perfil" on profiles for select using (auth.uid() = id);
create policy "usuário atualiza seu próprio perfil" on profiles for update using (auth.uid() = id);
create policy "usuário insere seu próprio perfil" on profiles for insert with check (auth.uid() = id);

create policy "usuário gerencia seus clientes" on clientes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "usuário gerencia seus produtos" on produtos for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "usuário gerencia seus pedidos" on pedidos for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "usuário gerencia suas transações" on transacoes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "usuário vê suas assinaturas" on assinaturas for select using (auth.uid() = user_id);

-- Cria automaticamente uma linha em `profiles` sempre que um usuário se
-- cadastra pelo Google (para o cadastro por e-mail, o próprio front-end já
-- insere o profile logo após o signUp — ver app/(auth)/cadastro/page.tsx).
-- Isso evita usuários "órfãos" sem perfil quando o login é feito via OAuth.
create or replace function public.criar_profile_no_signup()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, nome, nome_negocio, plano, fundador)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'nome_negocio', ''),
    'gratuito',
    false
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.criar_profile_no_signup();

-- Contagem de vagas de fundador (função utilitária para a landing page)
create or replace function contar_fundadores()
returns integer
language sql
security definer
as $$
  select count(*)::integer from profiles where fundador = true;
$$;
