
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
  
  // Mantém o valor original digitado pelo usuário
  const [inputValues, setInputValues] = useState({
    faturamento: "",
    taxas_repassadas: "",
    total_compras: ""
  });

  const formatCurrency = (value: string) => {
    // Remove tudo que não é número
    const numericValue = value.replace(/\D/g, "");
    
    // Se não houver valor, retorna vazio
    if (!numericValue) {
      return "";
    }
    
    // Converte para número e divide por 100 para considerar os centavos
    const numberValue = Number(numericValue) / 100;
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numberValue);
  };

  const parseCurrencyToNumber = (value: string): number => {
    const numericString = value
      .replace(/[R$\s.]/g, '')
      .replace(',', '.');
    return parseFloat(numericString) || 0;
  };

  const handleCurrencyInput = (e: React.ChangeEvent<HTMLInputElement>, field: keyof FormData) => {
    const rawValue = e.target.value;
    const formatted = formatCurrency(rawValue);
    const numericValue = parseCurrencyToNumber(formatted);
    
    // Atualiza o valor do input
    setInputValues(prev => ({
      ...prev,
      [field]: formatted || ""
    }));
    
    // Atualiza o valor numérico para cálculos
    setFormData(prev => ({
      ...prev,
      [field]: numericValue
    }));
  };

  const handleCalculate = () => {
    // Validação de campos zerados
    if (!inputValues.faturamento || formData.faturamento <= 0) {
      toast({
        title: "Erro",
        description: "O faturamento não pode ser zero.",
        variant: "destructive",
      });
      return;
    }

    if (!inputValues.total_compras || formData.total_compras <= 0) {
      toast({
        title: "Erro",
        description: "O total de compras não pode ser zero.",
        variant: "destructive",
      });
      return;
    }

    if (formData.inclui_taxas && (!inputValues.taxas_repassadas || formData.taxas_repassadas <= 0)) {
      toast({
        title: "Erro",
        description: "O total de taxas não pode ser zero quando marcado como incluso.",
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
            value={inputValues.faturamento}
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
              value={inputValues.taxas_repassadas}
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
            value={inputValues.total_compras}
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
