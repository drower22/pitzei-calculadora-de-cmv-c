
import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { DollarSign, PieChart, AlertCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { CalculationResult } from "./CalculatorForm";

interface ResultReportProps {
  result: CalculationResult;
  onBack: () => void;
}

export const ResultReport = ({ result, onBack }: ResultReportProps) => {
  const { toast } = useToast();
  const [emailOpen, setEmailOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [sending, setSending] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getAsterisks = (value: number) => {
    const numDigits = Math.floor(value).toString().length;
    return "*".repeat(numDigits);
  };

  const handleSendEmail = async () => {
    if (!email || !name) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    try {
      console.log('Iniciando salvamento no Supabase...', {
        url: supabase.config.supabaseUrl,
        email,
        result
      });

      // Primeiro, salvar os dados no Supabase
      const { data: savedData, error: dbError } = await supabase
        .from('calculadora_cmv')
        .insert({
          user_email: email,
          faturamento_real: result.faturamento_real,
          cmv_valor: result.cmv_valor,
          cmv_percentual: result.cmv_percentual,
          lucro_perdido: result.lucro_perdido
        })
        .select()
        .single();

      if (dbError) {
        console.error('Erro detalhado ao salvar no banco:', {
          code: dbError.code,
          message: dbError.message,
          details: dbError.details,
          hint: dbError.hint
        });
        throw dbError;
      }

      console.log('Dados salvos com sucesso:', savedData);

      // Depois, enviar o email
      console.log('Iniciando envio de email...');
      const requestData = {
        to: email,
        name: name,
        result: {
          faturamento_real: result.faturamento_real,
          cmv_valor: result.cmv_valor,
          cmv_percentual: result.cmv_percentual,
          lucro_perdido: result.lucro_perdido,
        },
      };

      const { data: emailResponse, error: emailError } = await supabase.functions.invoke('send-cmv-report', {
        body: requestData
      });

      if (emailError) {
        console.error('Erro detalhado ao enviar email:', {
          message: emailError.message,
          name: emailError.name,
          context: emailError
        });
        throw emailError;
      }

      console.log('Email enviado com sucesso:', emailResponse);

      toast({
        title: `${name}, seu relatório foi enviado!`,
        description: "Confira seu email para ver o resultado completo.",
      });
      setEmailOpen(false);
    } catch (error: any) {
      console.error("Erro detalhado na operação:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
        context: error
      });
      
      toast({
        title: "Erro no processamento",
        description: error.message || "Não foi possível processar sua solicitação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const isCMVHealthy = result.cmv_percentual <= 38;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <Card className="p-6 bg-gradient-to-br from-white to-gray-50">
          <div className="space-y-6">
            {isCMVHealthy ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-green-500" />
                  <h2 className="text-lg font-semibold text-green-500">Parabéns!</h2>
                </div>
                <p className="text-green-600 font-medium">
                  Sua pizzaria está com um CMV saudável. Continue com o ótimo trabalho!
                </p>
              </div>
            ) : (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <h2 className="text-lg font-semibold text-red-500">Atenção!</h2>
                </div>
                <p className="text-red-600 font-medium">
                  Sua pizzaria pode estar deixando de lucrar até R$ {getAsterisks(result.lucro_perdido)} por mês!
                </p>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <DollarSign className="w-6 h-6 text-blue-500 mb-2" />
                <p className="text-sm text-gray-600">Faturamento Real</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(result.faturamento_real)}
                </p>
              </div>

              <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <PieChart className="w-6 h-6 text-green-500 mb-2" />
                <p className="text-sm text-gray-600">Compras (CMV)</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(result.cmv_valor)}
                </p>
              </div>

              <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <p className="text-sm text-gray-600">CMV Percentual</p>
                <p className={`text-lg font-semibold ${!isCMVHealthy ? 'blur-[4px]' : ''}`}>
                  {result.cmv_percentual.toFixed(2)}%
                </p>
              </div>

              <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <p className="text-sm text-gray-600">Lucro Perdido Mensal</p>
                <p className={`text-lg font-semibold ${!isCMVHealthy ? 'blur-[4px] text-red-500' : 'text-green-500'}`}>
                  {formatCurrency(result.lucro_perdido)}
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={() => setEmailOpen(true)}
                className="bg-brand-orange hover:bg-brand-orange/90 text-white mt-6 w-full md:w-1/2"
              >
                Ver resultado completo
              </Button>
            </div>

            <Accordion type="single" collapsible className="mt-4">
              <AccordionItem value="calculation" className="border-none">
                <AccordionTrigger className="text-sm text-gray-500 hover:text-gray-700 hover:no-underline py-2">
                  Como o CMV é calculado?
                </AccordionTrigger>
                <AccordionContent className="text-xs text-gray-600 leading-relaxed">
                  O CMV (Custo da Mercadoria Vendida) é calculado dividindo o total de compras pelo faturamento real e multiplicando por 100 para obter a porcentagem.
                  <br /><br />
                  Fórmula: CMV = (Total de Compras ÷ Faturamento Real) × 100
                  <br /><br />
                  Para o setor de pizzarias, um CMV saudável deve estar em torno de 38%. Valores acima disso indicam que sua operação pode estar perdendo lucratividade.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </Card>
      </motion.div>

      <Dialog open={emailOpen} onOpenChange={setEmailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Receba sua análise completa</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para receber seu relatório detalhado.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              type="text"
              placeholder="Como prefere ser chamado(a)?"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              type="email"
              placeholder="Seu melhor email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button 
              onClick={handleSendEmail} 
              className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white"
              disabled={sending}
            >
              {sending ? "Enviando..." : "Receber resultado"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
