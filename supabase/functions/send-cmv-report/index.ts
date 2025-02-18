
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
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

const getStatusMessage = (cmv: number) => {
  if (cmv <= 38) return "Seu CMV está dentro do ideal para o setor!";
  if (cmv <= 42) return "Seu CMV está um pouco acima do ideal. Há espaço para melhorias.";
  return "Seu CMV está muito alto! Isso está impactando significativamente sua lucratividade.";
};

const getRecommendations = (cmv: number) => {
  const recommendations = [
    "Revise seus fornecedores e compare preços regularmente",
    "Implemente um controle rigoroso de estoque",
    "Padronize suas receitas e porções",
    "Monitore e reduza o desperdício de ingredientes",
    "Analise a precificação dos seus produtos"
  ];

  if (cmv <= 38) {
    return "Continue mantendo o bom trabalho! Algumas dicas para manter seu CMV controlado:\n" +
      recommendations.slice(0, 2).join("\n");
  }

  if (cmv <= 42) {
    return "Para melhorar seu CMV, considere:\n" +
      recommendations.slice(0, 3).join("\n");
  }

  return "Ações urgentes para reduzir seu CMV:\n" +
    recommendations.join("\n");
};

const handler = async (req: Request): Promise<Response> => {
  console.log("Function invoked with method:", req.method);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS request");
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method !== 'POST') {
      throw new Error(`HTTP method ${req.method} is not supported`);
    }

    console.log("Parsing request body...");
    const body = await req.json();
    console.log("Request body:", body);

    const { to, result } = body as EmailRequest;

    if (!to || !result) {
      throw new Error('Missing required fields: to and result are required');
    }

    console.log("Sending email to:", to);
    console.log("With result data:", result);

    const emailResponse = await resend.emails.send({
      from: "Calculadora de CMV <onboarding@resend.dev>",
      to: [to],
      subject: "Seu Relatório Detalhado de CMV",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <h1 style="color: #EA4D2C; text-align: center; margin-bottom: 30px;">Relatório Detalhado de CMV</h1>
          
          <div style="background-color: #FFF3F0; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h2 style="color: #EA4D2C; margin-bottom: 15px;">Resumo dos Resultados</h2>
            <p style="font-size: 18px; margin-bottom: 10px;">
              <strong>Faturamento Real:</strong> ${formatCurrency(result.faturamento_real)}
            </p>
            <p style="font-size: 18px; margin-bottom: 10px;">
              <strong>Total de Compras:</strong> ${formatCurrency(result.cmv_valor)}
            </p>
            <p style="font-size: 18px; margin-bottom: 10px;">
              <strong>CMV Atual:</strong> ${result.cmv_percentual.toFixed(2)}%
            </p>
            <p style="font-size: 18px; color: #EA4D2C; margin-bottom: 10px;">
              <strong>Lucro Perdido por Mês:</strong> ${formatCurrency(result.lucro_perdido)}
            </p>
          </div>

          <div style="background-color: #F5F5F5; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h2 style="color: #333; margin-bottom: 15px;">Análise Detalhada</h2>
            <p style="margin-bottom: 15px;">
              <strong>Situação Atual:</strong><br>
              ${getStatusMessage(result.cmv_percentual)}
            </p>
            <p style="margin-bottom: 15px;">
              <strong>Como é calculado:</strong><br>
              O CMV (Custo da Mercadoria Vendida) é calculado dividindo o total de compras pelo faturamento real e multiplicando por 100 para obter a porcentagem.<br><br>
              Fórmula: CMV = (Total de Compras ÷ Faturamento Real) × 100
            </p>
            <p>
              <strong>O que isso significa:</strong><br>
              Para o setor de pizzarias, um CMV saudável deve estar em torno de 38%. 
              ${result.cmv_percentual > 38 
                ? `Seu CMV está ${(result.cmv_percentual - 38).toFixed(1)}% acima do ideal.` 
                : 'Seu CMV está dentro do padrão ideal do mercado!'}
            </p>
          </div>

          <div style="background-color: #E8F5E9; padding: 20px; border-radius: 8px;">
            <h2 style="color: #2E7D32; margin-bottom: 15px;">Recomendações</h2>
            <p style="white-space: pre-line;">
              ${getRecommendations(result.cmv_percentual)}
            </p>
          </div>

          <div style="margin-top: 30px; text-align: center; color: #666; font-size: 14px;">
            <p>Este relatório foi gerado automaticamente pela Calculadora de CMV.</p>
            <p>Para mais informações e dicas sobre gestão financeira de pizzarias, entre em contato conosco.</p>
          </div>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    console.error("Error in send-cmv-report function:", error);
    
    return new Response(
      JSON.stringify({
        error: error.message,
        details: error.stack,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
};

serve(handler);
