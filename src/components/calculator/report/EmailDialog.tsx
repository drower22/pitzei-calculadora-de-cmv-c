
import { useState } from "react";
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
import type { CalculationResult } from "../CalculatorForm";

interface EmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: CalculationResult;
  onSuccess: () => void;
}

export const EmailDialog = ({ open, onOpenChange, result, onSuccess }: EmailDialogProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [sending, setSending] = useState(false);

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
        email,
        dados: {
          faturamento_real: result.faturamento_real,
          cmv_valor: result.cmv_valor,
          cmv_percentual: result.cmv_percentual,
          lucro_perdido: result.lucro_perdido
        }
      });

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
        throw new Error(`Erro ao salvar dados: ${dbError.message}`);
      }

      console.log('Dados salvos com sucesso:', savedData);

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
        throw new Error(`Erro ao enviar email: ${emailError.message}`);
      }

      console.log('Email enviado com sucesso:', emailResponse);

      toast({
        title: `${name}, seu relatório foi enviado!`,
        description: "Confira seu email para ver o resultado completo.",
      });
      onOpenChange(false);
      
      setTimeout(() => {
        onSuccess();
      }, 1500);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
  );
};
