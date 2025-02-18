
import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Mail, DollarSign, PieChart, AlertTriangle } from "lucide-react";
import type { CalculationResult } from "./CalculatorForm";

interface ResultReportProps {
  result: CalculationResult;
  onBack: () => void;
}

export const ResultReport = ({ result, onBack }: ResultReportProps) => {
  const { toast } = useToast();
  const [emailOpen, setEmailOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusColor = (cmv: number) => {
    if (cmv <= 38) return "text-green-600";
    if (cmv <= 42) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusMessage = (cmv: number) => {
    if (cmv <= 38) return "Seu CMV está dentro do ideal para o setor!";
    if (cmv <= 42) return "Seu CMV está um pouco acima do ideal. Há espaço para melhorias.";
    return "Seu CMV está muito alto! Isso está impactando significativamente sua lucratividade.";
  };

  const handleSendEmail = async () => {
    if (!email) {
      toast({
        title: "Erro",
        description: "Por favor, insira um email válido.",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    try {
      console.log("Sending email request with data:", {
        to: email,
        result: {
          faturamento_real: result.faturamento_real,
          cmv_valor: result.cmv_valor,
          cmv_percentual: result.cmv_percentual,
          lucro_perdido: result.lucro_perdido,
        },
      });

      const { error } = await supabase.functions.invoke('send-cmv-report', {
        body: {
          to: email,
          result: {
            faturamento_real: result.faturamento_real,
            cmv_valor: result.cmv_valor,
            cmv_percentual: result.cmv_percentual,
            lucro_perdido: result.lucro_perdido,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "O relatório foi enviado para seu email.",
      });
      setEmailOpen(false);
    } catch (error: any) {
      console.error("Error sending email:", error);
      toast({
        title: "Erro no envio",
        description: "Não foi possível enviar o email. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-6 space-y-6 bg-gradient-to-br from-white to-gray-50">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold mb-2">Relatório de CMV</h3>
            <div className="bg-red-50 p-6 rounded-lg border border-red-100 animate-pulse">
              <h4 className="text-xl font-bold text-red-600 mb-2">
                Atenção! Sua pizzaria está deixando de lucrar
              </h4>
              <p className="text-3xl font-bold text-red-500">
                {formatCurrency(result.lucro_perdido)} por mês!
              </p>
            </div>
            <p className={`text-lg font-semibold ${getStatusColor(result.cmv_percentual)}`}>
              {getStatusMessage(result.cmv_percentual)}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <DollarSign className="w-6 h-6 text-blue-500 mb-2" />
              <p className="text-sm text-gray-600">Faturamento Real</p>
              <p className="text-lg font-semibold">
                {formatCurrency(result.faturamento_real)}
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <PieChart className="w-6 h-6 text-green-500 mb-2" />
              <p className="text-sm text-gray-600">Compras</p>
              <p className="text-lg font-semibold">
                {formatCurrency(result.cmv_valor)}
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <AlertTriangle className="w-6 h-6 text-yellow-500 mb-2" />
              <p className="text-sm text-gray-600">CMV Percentual</p>
              <p className="text-lg font-semibold">
                {result.cmv_percentual.toFixed(2)}%
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <AlertTriangle className="w-6 h-6 text-red-500 mb-2" />
              <p className="text-sm text-gray-600">Lucro Perdido</p>
              <p className="text-lg font-semibold text-red-600">
                {formatCurrency(result.lucro_perdido)}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Accordion type="single" collapsible>
              <AccordionItem value="calculation">
                <AccordionTrigger className="text-brand-orange hover:text-brand-orange/90">
                  Como o CMV é calculado?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    O CMV (Custo da Mercadoria Vendida) é calculado dividindo o total de compras pelo faturamento real e multiplicando por 100 para obter a porcentagem.
                    <br /><br />
                    Fórmula: CMV = (Total de Compras ÷ Faturamento Real) × 100
                    <br /><br />
                    Para o setor de pizzarias, um CMV saudável deve estar em torno de 38%. Valores acima disso indicam que sua operação pode estar perdendo lucratividade.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <Button 
            onClick={() => setEmailOpen(true)} 
            className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white shadow-lg hover:shadow-xl transition-all"
          >
            <Mail className="w-4 h-4 mr-2" />
            Quero receber o resultado
          </Button>
        </Card>
      </motion.div>

      <Dialog open={emailOpen} onOpenChange={setEmailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Receba o relatório por email</DialogTitle>
            <DialogDescription>
              Digite seu email para receber uma cópia detalhada do relatório.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button 
              onClick={handleSendEmail} 
              className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white"
              disabled={sending}
            >
              {sending ? "Enviando..." : "Enviar Relatório"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
