import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  result: {
    faturamento_real: number;
    cmv_valor: number;
    cmv_percentual: number;
    lucro_perdido: number;
  };
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, result }: EmailRequest = await req.json();

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a1f2c; text-align: center;">Relatório de CMV da sua Pizzaria</h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #ea384c; text-align: center; margin-bottom: 20px;">
            Sua pizzaria está deixando de lucrar ${formatCurrency(result.lucro_perdido)} todos os meses!
          </h3>
          
          <div style="margin: 15px 0;">
            <p style="margin: 5px 0;"><strong>Faturamento Real:</strong> ${formatCurrency(result.faturamento_real)}</p>
            <p style="margin: 5px 0;"><strong>CMV em Valor:</strong> ${formatCurrency(result.cmv_valor)}</p>
            <p style="margin: 5px 0;"><strong>CMV Percentual:</strong> ${result.cmv_percentual.toFixed(2)}%</p>
          </div>

          <p style="background-color: #fff3f3; padding: 15px; border-radius: 6px; color: #ea384c;">
            <strong>Atenção:</strong> O CMV ideal para pizzarias é de 38%. 
            ${result.cmv_percentual > 38 
              ? `Seu CMV está ${(result.cmv_percentual - 38).toFixed(1)}% acima do ideal.` 
              : 'Parabéns! Seu CMV está dentro do ideal para o setor.'}
          </p>
        </div>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "CMV Calculator <onboarding@resend.dev>",
        to: [to],
        subject: "Relatório de CMV da sua Pizzaria",
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
};

serve(handler);