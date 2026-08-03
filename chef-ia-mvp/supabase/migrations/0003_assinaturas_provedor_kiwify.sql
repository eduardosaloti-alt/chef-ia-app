-- Chef IA -- Ajusta a trava da coluna assinaturas.provedor para aceitar 'kiwify'
-- (o codigo ja usa Kiwify como meio de pagamento, mas a trava original so aceitava stripe/mercadopago)

alter table assinaturas drop constraint if exists assinaturas_provedor_check;

alter table assinaturas add constraint assinaturas_provedor_check
check (provedor in ('stripe','mercadopago','kiwify','asaas'));
