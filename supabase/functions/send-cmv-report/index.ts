
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const getStatusMessage = (cmv: number) => {
  if (cmv <= 38) return "Seu CMV está dentro do ideal para o setor!";
  if (cmv <= 42) return "Seu CMV está um pouco acima do ideal. Há espaço para melhorias.";
  return "Seu CMV está muito alto! Isso está impactando significativamente sua lucratividade.";
};

console.log("Function starting...");

try {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  console.log("API Key status:", apiKey ? "Present" : "Missing");
  
  const resend = new Resend(apiKey);

  const handler = async (req: Request): Promise<Response> => {
    console.log("New request received:", req.method);

    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const { to, name, result } = await req.json();
      console.log("Sending report to:", to);
      console.log("Result data:", result);

      const isCMVHealthy = result.cmv_percentual <= 38;
      const subject = isCMVHealthy 
        ? "Parabéns! Sua Pizzaria está no caminho certo 🎉 | PITZEI"
        : "Atenção! Sua Pizzaria pode estar perdendo lucro 🚨 | PITZEI";

      const whatsappLink = "https://wa.me/5541985249106?text=" + encodeURIComponent("Olá. Quero saber como fazer para minha pizzaria lucrar mais todos os meses.");

      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .alert { padding: 15px; border-radius: 8px; margin: 20px 0; }
            .alert-success { background-color: #f0fdf4; border: 1px solid #bbf7d0; }
            .alert-danger { background-color: #fef2f2; border: 1px solid #fecaca; }
            .metric { background-color: #f7fafc; padding: 15px; border-radius: 8px; margin: 10px 0; }
            .footer { margin-top: 30px; font-size: 14px; color: #666; }
            .cta-button { 
              display: inline-block; 
              background-color: #f97316;
              color: white; 
              padding: 12px 24px; 
              text-decoration: none; 
              border-radius: 6px; 
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${isCMVHealthy ? 'Parabéns pelo resultado!' : 'Relatório de CMV'}</h1>
            </div>
            
            <p>Olá, ${name}!</p>

            <div class="${isCMVHealthy ? 'alert alert-success' : 'alert alert-danger'}">
              <h2 style="color: ${isCMVHealthy ? '#16a34a' : '#dc2626'}; margin: 0;">
                ${isCMVHealthy ? 'Excelente trabalho!' : 'Atenção!'}
              </h2>
              <p style="font-size: 18px;">
                ${isCMVHealthy 
                  ? 'Sua pizzaria está com um CMV saudável. Continue com o ótimo trabalho!' 
                  : `Sua pizzaria está deixando de lucrar <strong>${formatCurrency(result.lucro_perdido)}</strong> por mês!`}
              </p>
            </div>

            <div class="metric">
              <h3>Faturamento Real</h3>
              <p>${formatCurrency(result.faturamento_real)}</p>
            </div>

            <div class="metric">
              <h3>Compras (CMV)</h3>
              <p>${formatCurrency(result.cmv_valor)}</p>
            </div>

            <div class="metric">
              <h3>CMV Percentual</h3>
              <p>${result.cmv_percentual.toFixed(2)}%</p>
            </div>

            <div class="metric">
              <h3>Lucro Perdido Mensal</h3>
              <p style="color: ${isCMVHealthy ? '#16a34a' : '#dc2626'};">
                ${formatCurrency(result.lucro_perdido)}
              </p>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <p style="font-size: 16px; margin-bottom: 20px;">
                ${isCMVHealthy 
                  ? 'Quer saber como manter esses ótimos resultados e melhorar ainda mais?' 
                  : 'Quer saber como reverter essa situação e aumentar seus lucros?'}
              </p>
              <a href="${whatsappLink}" class="cta-button" target="_blank">
                Falar com Especialista
              </a>
            </div>

            <div class="footer">
              <p>Para o setor de pizzarias, um CMV saudável deve estar em torno de 38%. ${
                isCMVHealthy 
                  ? 'Continue mantendo seu CMV controlado para maximizar seus resultados!' 
                  : 'Valores acima disso indicam que sua operação pode estar perdendo lucratividade.'
              }</p>
              <hr>
              <p>Este relatório foi gerado automaticamente pela PITZEI - Gestão para Pizzarias.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const emailResponse = await resend.emails.send({
        from: "PITZEI <cmv@pitzei.com.br>",
        to: [to],
        subject: subject,
        html: emailHtml
      });

      console.log("Email response:", emailResponse);

      if (emailResponse.error) {
        throw new Error(`Resend API Error: ${JSON.stringify(emailResponse.error)}`);
      }

      return new Response(
        JSON.stringify({ success: true, data: emailResponse }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );

    } catch (error) {
      console.error("Detailed error:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });

      return new Response(
        JSON.stringify({
          error: error.message,
          details: error.stack
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }
  };

  serve(handler);

} catch (error) {
  console.error("Initialization error:", {
    name: error.name,
    message: error.message,
    stack: error.stack
  });
  
  serve(() => new Response(
    JSON.stringify({ error: "Service initialization failed", details: error.message }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    }
  ));
}
