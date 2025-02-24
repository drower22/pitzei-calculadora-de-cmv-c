
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

console.log("Function starting...");

try {
  // Log the API key status (without exposing it)
  const apiKey = Deno.env.get("RESEND_API_KEY");
  console.log("API Key status:", apiKey ? "Present" : "Missing");
  console.log("API Key length:", apiKey?.length);

  const resend = new Resend(apiKey);

  const handler = async (req: Request): Promise<Response> => {
    console.log("New request received:", req.method);

    // Handle CORS
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const body = await req.json();
      console.log("Attempting to send email to:", body.to);

      // Test with a simpler email first
      const emailResponse = await resend.emails.send({
        from: "Calculadora <sent@resend.dev>",
        to: [body.to],
        subject: "Teste de Envio",
        html: "<p>Este é um teste de envio de email.</p>"
      });

      console.log("Raw email response:", emailResponse);

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
