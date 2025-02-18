
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@0.15.0"

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Preflight request handling
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      throw new Error('Method not allowed')
    }

    const { to, result } = await req.json()

    if (!to || !result) {
      throw new Error('Missing required fields')
    }

    console.log('Sending email to:', to)
    console.log('With data:', result)

    const data = await resend.emails.send({
      from: 'Calculadora de CMV <onboarding@resend.dev>',
      to: [to],
      subject: 'Seu Relatório de CMV',
      html: `<p>Seu relatório está pronto!</p>
             <p>CMV: ${result.cmv_percentual.toFixed(2)}%</p>
             <p>Faturamento: R$ ${result.faturamento_real.toFixed(2)}</p>`,
    })

    console.log('Email sent:', data)

    return new Response(
      JSON.stringify(data),
      {
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
      },
    )
  } catch (err) {
    console.error('Error:', err)
    return new Response(
      JSON.stringify({ error: err.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
      },
    )
  }
})
