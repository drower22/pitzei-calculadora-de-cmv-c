
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
      const requestData = {
        to: email,
        result: {
          faturamento_real: result.faturamento_real,
          cmv_valor: result.cmv_valor,
          cmv_percentual: result.cmv_percentual,
          lucro_perdido: result.lucro_perdido,
        },
      };

      const { data, error } = await supabase.functions.invoke('send-cmv-report', {
        body: requestData
      });

      if (error) throw error;

      toast({
        title: `${name}, seu relatório foi enviado!`,
        description: "Confira seu email para ver o resultado completo.",
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
        className="space-y-6"
      >
        <Card className="p-6 bg-gradient-to-br from-white to-gray-50">
          <div className="space-y-6">
            <motion.div 
              animate={{ 
                scale: [1, 1.02, 1],
                boxShadow: [
                  "0 0 0 rgba(239, 68, 68, 0)",
                  "0 0 20px rgba(239, 68, 68, 0.3)",
                  "0 0 0 rgba(239, 68, 68, 0)"
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="p-6 bg-red-50 border-2 border-red-300 rounded-lg"
            >
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-6 h-6 text-red-500" />
                <h2 className="text-xl font-bold text-red-500">Atenção!</h2>
              </div>
              <p className="text-red-600 font-medium text-lg">
                Sua pizzaria está deixando de lucrar R$ ***** por mês!
              </p>
            </motion.div>

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
                <p className="text-sm text-gray-600">Compras</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(result.cmv_valor)}
                </p>
              </div>
            </div>

            <Button
              onClick={() => setEmailOpen(true)}
              className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white mt-6 py-6 text-lg"
            >
              Quero receber o resultado completo
            </Button>
          </div>
        </Card>
      </motion.div>

      <Dialog open={emailOpen} onOpenChange={setEmailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">Receba o resultado completo</DialogTitle>
            <DialogDescription>
              Você receberá uma análise detalhada do CMV da sua pizzaria, incluindo:
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>Percentual exato do seu CMV</li>
                <li>Quanto está deixando de lucrar</li>
                <li>Recomendações personalizadas</li>
              </ul>
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
              className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white py-6 text-lg"
              disabled={sending}
            >
              {sending ? "Enviando..." : "Quero receber o resultado"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
