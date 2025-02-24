
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@0.15.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { to, result } = await req.json();

    console.log("Received request:", { to, result });

    if (!to || !result) {
      throw new Error("Missing required fields: to and result are required");
    }

    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value);
    };

    const data = await resend.emails.send({
      from: "Calculadora CMV <calculadora@pitzei.com.br>",
      to: [to],
      subject: "Relatório de CMV da sua Pizzaria",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #FF6B00; text-align: center;">Seu Relatório de CMV</h1>
          
          <div style="background-color: #FFF5EB; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="font-size: 18px; color: #333;">
              <strong>CMV Atual:</strong> ${result.cmv_percentual.toFixed(2)}%
            </p>
            <p style="font-size: 18px; color: #333;">
              <strong>Faturamento:</strong> ${formatCurrency(result.faturamento_real)}
            </p>
            <p style="font-size: 18px; color: #333;">
              <strong>Total de Compras:</strong> ${formatCurrency(result.cmv_valor)}
            </p>
            ${result.lucro_perdido > 0 ? `
              <div style="background-color: #FFE5E5; padding: 15px; border-radius: 6px; margin-top: 20px;">
                <p style="color: #FF0000; font-size: 18px; margin: 0;">
                  <strong>Atenção!</strong> Sua pizzaria está deixando de lucrar ${formatCurrency(result.lucro_perdido)} por mês!
                </p>
              </div>
            ` : ''}
          </div>
          
          <p style="color: #666; font-size: 14px;">
            Este relatório foi gerado pela Calculadora de CMV da Pitzei.
          </p>

          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666;">
              Pitzei - Tecnologia para Pizzarias
              <br />
              <a href="https://pitzei.com.br" style="color: #FF6B00; text-decoration: none;">pitzei.com.br</a>
            </p>
          </div>
        </div>
      `,
    });

    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("Error:", error.message);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to send email"
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
});
