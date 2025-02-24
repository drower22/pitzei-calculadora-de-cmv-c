
import { useState, useEffect } from "react";
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
import { DollarSign, PieChart } from "lucide-react";
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
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      
      if (scrollPosition >= documentHeight - 100 && !hasScrolled) {
        setHasScrolled(true);
        setEmailOpen(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasScrolled]);

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
      >
        <Card className="p-6 space-y-6 bg-gradient-to-br from-white to-gray-50">
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
          </div>
        </Card>
      </motion.div>

      <Dialog open={emailOpen} onOpenChange={setEmailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Veja seu resultado completo</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para receber uma análise detalhada do seu CMV.
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
              {sending ? "Enviando..." : "Ver resultado completo"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
