-- Chef IA -- Estoque de insumos e receitas (base para o plano PRO)
-- Rode este arquivo no SQL Editor do Supabase (depois de revisar), na mesma ordem das migrations anteriores.

create table if not exists insumos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  nome text not null,
  unidade text default 'g',
  quantidade_estoque numeric default 0,
  quantidade_minima numeric default 0,
  custo_unitario numeric default 0,
  criado_em timestamptz default now()
  );

create table if not exists receitas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  nome text not null,
  modo_preparo text,
  rendimento text,
  gerado_por_ia boolean default false,
  criado_em timestamptz default now()
  );

create table if not exists receita_itens (
  id uuid primary key default gen_random_uuid(),
  receita_id uuid references receitas(id) on delete cascade,
  insumo_id uuid references insumos(id) on delete set null,
  quantidade numeric not null,
  unidade text,
  criado_em timestamptz default now()
  );

-- Row Level Security: cada usuaria so acessa seus proprios dados
alter table insumos enable row level security;
alter table receitas enable row level security;
alter table receita_itens enable row level security;

create policy "usuaria ve seus proprios insumos" on insumos for select using (auth.uid() = user_id);
create policy "usuaria insere seus proprios insumos" on insumos for insert with check (auth.uid() = user_id);
create policy "usuaria atualiza seus proprios insumos" on insumos for update using (auth.uid() = user_id);
create policy "usuaria remove seus proprios insumos" on insumos for delete using (auth.uid() = user_id);

create policy "usuaria ve suas proprias receitas" on receitas for select using (auth.uid() = user_id);
create policy "usuaria insere suas proprias receitas" on receitas for insert with check (auth.uid() = user_id);
create policy "usuaria atualiza suas proprias receitas" on receitas for update using (auth.uid() = user_id);
create policy "usuaria remove suas proprias receitas" on receitas for delete using (auth.uid() = user_id);

create policy "usuaria ve os itens das proprias receitas" on receita_itens for select using (
  exists (select 1 from receitas where receitas.id = receita_itens.receita_id and receitas.user_id = auth.uid())
  );
create policy "usuaria insere itens nas proprias receitas" on receita_itens for insert with check (
  exists (select 1 from receitas where receitas.id = receita_itens.receita_id and receitas.user_id = auth.uid())
  );
create policy "usuaria atualiza itens das proprias receitas" on receita_itens for update using (
  exists (select 1 from receitas where receitas.id = receita_itens.receita_id and receitas.user_id = auth.uid())
  );
create policy "usuaria remove itens das proprias receitas" on receita_itens for delete using (
  exists (select 1 from receitas where receitas.id = receita_itens.receita_id and receitas.user_id = auth.uid())
  );
