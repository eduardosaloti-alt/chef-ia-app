-- Chef IA — Suporte a assinaturas via Kiwify
-- Rode este arquivo no SQL Editor do Supabase (ou via supabase CLI: supabase db push)

-- Permite 'kiwify' como provedor em `assinaturas` (antes só aceitava
-- 'stripe' e 'mercadopago'). Descobre o nome real da constraint de check
-- em vez de assumir um nome fixo, pra funcionar mesmo se o Postgres tiver
-- gerado um nome diferente do padrão.
do $$
declare
  nome_constraint text;
begin
  select con.conname into nome_constraint
  from pg_constraint con
  join pg_class rel on rel.oid = con.conrelid
  where rel.relname = 'assinaturas'
    and con.contype = 'c'
    and pg_get_constraintdef(con.oid) ilike '%provedor%';

  if nome_constraint is not null then
    execute format('alter table assinaturas drop constraint %I', nome_constraint);
  end if;
end $$;

alter table assinaturas
  add constraint assinaturas_provedor_check check (provedor in ('stripe', 'mercadopago', 'kiwify'));

-- Guarda o ID do pedido na Kiwify, pra conseguir rastrear/depurar cada venda.
alter table assinaturas add column if not exists kiwify_order_id text;
