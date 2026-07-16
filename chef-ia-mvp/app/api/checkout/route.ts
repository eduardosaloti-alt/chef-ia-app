import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
* POST /api/checkout
* Redireciona a assinante para o checkout da Kiwify (Chef IA).
*
* Promocao "Fundadora": enquanto restarem vagas das 100 primeiras
* (contar_fundadores() < 100), a assinante paga R$19,90/mes (plano Fundadora).
* Depois de preenchidas as vagas, o valor passa a ser R$29,90/mes (plano Pro).
*/
const KIWIFY_FUNDADORA = "https://pay.kiwify.com.br/2Qutuft"; // R$19,90/mes
const KIWIFY_PRO = "https://pay.kiwify.com.br/20qPSqL"; // R$29,90/mes

export async function POST(request: Request) {
      const supabase = createClient();
      const {
            data: { user },
      } = await supabase.auth.getUser();

if (!user) {
      return NextResponse.json(
            { erro: "Voce precisa estar logada para assinar." },
            { status: 401 }
            );
}

try {
      const vagas = (await supabase.rpc("contar_fundadores"))?.data ?? 0;
      const aindaHaVagas = vagas < 100;
      const url = aindaHaVagas ? KIWIFY_FUNDADORA : KIWIFY_PRO;

      return NextResponse.json({ url });
} catch (error: any) {
      console.error("Erro ao redirecionar para o checkout Kiwify:", error.message);
      return NextResponse.json(
            { erro: "Erro ao iniciar o checkout. Tente novamente." },
            { status: 500 }
            );
}
}
