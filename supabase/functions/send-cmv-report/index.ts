
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Simplified initialization
console.log("Function starting...");

try {
  console.log("Initializing Resend...");
  const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
  console.log("Resend initialized successfully");

  console.log("Initializing Supabase client...");
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );
  console.log("Supabase client initialized");

  const handler = async (req: Request): Promise<Response> => {
    console.log("New request received");

    // Handle CORS
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const body = await req.json();
      console.log("Request body:", JSON.stringify(body, null, 2));

      const emailResponse = await resend.emails.send({
        from: "Calculadora CMV <onboarding@resend.dev>",
        to: [body.to],
        subject: "Teste - Relatório de CMV",
        html: "<p>Teste de envio de email</p>"
      });

      console.log("Email response:", JSON.stringify(emailResponse, null, 2));

      return new Response(
        JSON.stringify({ success: true, emailResponse }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );

    } catch (error) {
      console.error("Handler error:", {
        name: error.name,
        message: error.message,
        stack: error.stack
      });

      return new Response(
        JSON.stringify({
          error: error.message,
          name: error.name,
          stack: error.stack
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
  
  // Provide a basic handler for when initialization fails
  serve(() => new Response(
    JSON.stringify({ error: "Service initialization failed" }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    }
  ));
}
