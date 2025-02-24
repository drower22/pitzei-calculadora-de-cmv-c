
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CalculationResult {
  faturamento_real: number;
  cmv_valor: number;
  cmv_percentual: number;
  lucro_perdido: number;
}

interface EmailRequest {
  to: string;
  result: CalculationResult;
}

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, result }: EmailRequest = await req.json();

    // Salvar os dados no Supabase
    const { error: dbError } = await supabaseClient
      .from('calculadora_cmv')
      .insert({
        user_email: to,
        faturamento_real: result.faturamento_real,
        cmv_valor: result.cmv_valor,
        cmv_percentual: result.cmv_percentual,
        lucro_perdido: result.lucro_perdido
      });

    if (dbError) {
      throw new Error(`Erro ao salvar no banco: ${dbError.message}`);
    }

    // Formatar valores para o email
    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value);
    };

    // Enviar email com o relatório
    const emailResponse = await resend.emails.send({
      from: "Calculadora CMV <onboarding@resend.dev>",
      to: [to],
      subject: "Seu Relatório de CMV",
      html: `
        <h1>Relatório de CMV</h1>
        <p>Aqui está o resultado da sua análise de CMV:</p>
        
        <ul>
          <li><strong>Faturamento Real:</strong> ${formatCurrency(result.faturamento_real)}</li>
          <li><strong>Valor do CMV:</strong> ${formatCurrency(result.cmv_valor)}</li>
          <li><strong>Percentual do CMV:</strong> ${result.cmv_percentual.toFixed(2)}%</li>
          <li><strong>Lucro Perdido:</strong> ${formatCurrency(result.lucro_perdido)}</li>
        </ul>

        <p style="color: ${result.cmv_percentual <= 38 ? 'green' : result.cmv_percentual <= 42 ? 'orange' : 'red'}">
          ${result.cmv_percentual <= 38 
            ? "Seu CMV está dentro do ideal para o setor!" 
            : result.cmv_percentual <= 42 
              ? "Seu CMV está um pouco acima do ideal. Há espaço para melhorias." 
              : "Seu CMV está muito alto! Isso está impactando significativamente sua lucratividade."}
        </p>

        <p>Para melhorar seu CMV, considere:</p>
        <ul>
          <li>Revisar seus fornecedores e negociar melhores preços</li>
          <li>Otimizar seu cardápio e fichas técnicas</li>
          <li>Controlar melhor o estoque e evitar perdas</li>
          <li>Analisar sua precificação</li>
        </ul>

        <p>Obrigado por usar nossa calculadora!</p>
      `,
    });

    if (emailResponse.error) {
      throw new Error(`Erro ao enviar email: ${emailResponse.error}`);
    }

    return new Response(
      JSON.stringify({ message: "Dados salvos e email enviado com sucesso" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Erro na função send-cmv-report:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
