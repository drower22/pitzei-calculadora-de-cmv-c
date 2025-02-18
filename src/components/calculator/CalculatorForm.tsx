
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { Calculator, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface FormData {
  faturamento: number;
  inclui_taxas: boolean;
  taxas_repassadas: number;
  total_compras: number;
}

interface CalculatorFormProps {
  onCalculate: (result: CalculationResult) => void;
}

export interface CalculationResult {
  cmv_valor: number;
  cmv_percentual: number;
  lucro_perdido: number;
  faturamento_real: number;
}

export const CalculatorForm = ({ onCalculate }: CalculatorFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    faturamento: 0,
    inclui_taxas: false,
    taxas_repassadas: 0,
    total_compras: 0,
  });

  const formatCurrency = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numericValue = value.replace(/\D/g, "");
    
    // Converte para número e divide por 100 para considerar os centavos
    const numberValue = Number(numericValue) / 100;
    
    // Formata o número para moeda brasileira
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numberValue);
  };

  const parseCurrencyToNumber = (value: string): number => {
    // Remove R$, espaços e pontos, troca vírgula por ponto
    const numericString = value
      .replace(/[R$\s.]/g, '')
      .replace(',', '.');
    return Number(numericString);
  };

  const handleCurrencyInput = (e: React.ChangeEvent<HTMLInputElement>, field: keyof FormData) => {
    const formatted = formatCurrency(e.target.value);
    const numericValue = parseCurrencyToNumber(formatted);
    
    setFormData(prev => ({
      ...prev,
      [field]: numericValue
    }));
    
    e.target.value = formatted;
  };

  const handleCalculate = () => {
    try {
      if (!formData.faturamento || !formData.total_compras) {
        toast({
          title: "Erro",
          description: "Por favor, preencha todos os campos obrigatórios.",
          variant: "destructive",
        });
        return;
      }

      const faturamentoReal = formData.inclui_taxas
        ? formData.faturamento - formData.taxas_repassadas
        : formData.faturamento;

      const cmv_valor = formData.total_compras;
      const cmv_percentual = (formData.total_compras / faturamentoReal) * 100;
      const lucro_perdido = cmv_percentual > 38 
        ? ((cmv_percentual - 38) / 100) * faturamentoReal
        : 0;

      onCalculate({
        cmv_valor,
        cmv_percentual,
        lucro_perdido,
        faturamento_real: faturamentoReal
      });

      toast({
        title: "Sucesso!",
        description: "Cálculo realizado com sucesso.",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao realizar o cálculo.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <Calculator className="w-12 h-12 mx-auto mb-4 text-brand-orange" />
        <h2 className="text-2xl md:text-3xl font-bold text-brand-black">Calculadora de CMV</h2>
        <p className="text-gray-600 mt-2 font-arial">
          Descubra se sua pizzaria está perdendo dinheiro com um CMV alto
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="faturamento" className="text-sm font-medium text-brand-black">
            Faturamento total do último mês
          </Label>
          <Input
            id="faturamento"
            type="text"
            placeholder="R$ 0,00"
            className="border-2 focus:border-brand-orange focus:ring-brand-orange"
            onChange={(e) => handleCurrencyInput(e, 'faturamento')}
            value={formData.faturamento ? formatCurrency(formData.faturamento.toString()) : ''}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-brand-black">
            Nesse total estão inclusos taxas pagas diretamente aos entregadores?
          </Label>
          <RadioGroup
            value={formData.inclui_taxas ? "yes" : "no"}
            onValueChange={(value) =>
              setFormData({ ...formData, inclui_taxas: value === "yes" })
            }
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="yes" className="text-brand-orange" />
              <Label htmlFor="yes">Sim</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no" className="text-brand-orange" />
              <Label htmlFor="no">Não</Label>
            </div>
          </RadioGroup>
        </div>

        {formData.inclui_taxas && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <Label htmlFor="taxas" className="text-sm font-medium text-brand-black">
              Total repassado em taxas
            </Label>
            <Input
              id="taxas"
              type="text"
              placeholder="R$ 0,00"
              className="border-2 focus:border-brand-orange focus:ring-brand-orange"
              onChange={(e) => handleCurrencyInput(e, 'taxas_repassadas')}
              value={formData.taxas_repassadas ? formatCurrency(formData.taxas_repassadas.toString()) : ''}
            />
          </motion.div>
        )}

        <div className="space-y-2">
          <Label htmlFor="compras" className="text-sm font-medium text-brand-black">
            Total de compras do último mês
          </Label>
          <Input
            id="compras"
            type="text"
            placeholder="R$ 0,00"
            className="border-2 focus:border-brand-orange focus:ring-brand-orange"
            onChange={(e) => handleCurrencyInput(e, 'total_compras')}
            value={formData.total_compras ? formatCurrency(formData.total_compras.toString()) : ''}
          />
        </div>

        <Button 
          onClick={handleCalculate} 
          className="w-full h-12 mt-6 bg-brand-orange hover:bg-brand-orange/90 text-white font-axiforma
                     shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg"
        >
          Calcular CMV
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </motion.div>
  );
};
