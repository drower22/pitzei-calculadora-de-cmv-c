import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { Calculator, DollarSign, ArrowRight } from "lucide-react";
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
        <Calculator className="w-12 h-12 mx-auto mb-4 text-blue-500" />
        <h2 className="text-2xl font-bold text-gray-900">Calculadora de CMV</h2>
        <p className="text-gray-600 mt-2">
          Descubra se sua pizzaria está perdendo dinheiro com um CMV alto
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="faturamento" className="text-sm font-medium">
            Faturamento total do último mês
          </Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <Input
              id="faturamento"
              type="number"
              placeholder="0,00"
              className="pl-10"
              value={formData.faturamento || ""}
              onChange={(e) =>
                setFormData({ ...formData, faturamento: Number(e.target.value) })
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Inclui taxas de entrega?</Label>
          <RadioGroup
            value={formData.inclui_taxas ? "yes" : "no"}
            onValueChange={(value) =>
              setFormData({ ...formData, inclui_taxas: value === "yes" })
            }
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="yes" />
              <Label htmlFor="yes">Sim</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no" />
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
            <Label htmlFor="taxas" className="text-sm font-medium">
              Total repassado em taxas
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                id="taxas"
                type="number"
                placeholder="0,00"
                className="pl-10"
                value={formData.taxas_repassadas || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    taxas_repassadas: Number(e.target.value),
                  })
                }
              />
            </div>
          </motion.div>
        )}

        <div className="space-y-2">
          <Label htmlFor="compras" className="text-sm font-medium">
            Total de compras do último mês
          </Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <Input
              id="compras"
              type="number"
              placeholder="0,00"
              className="pl-10"
              value={formData.total_compras || ""}
              onChange={(e) =>
                setFormData({ ...formData, total_compras: Number(e.target.value) })
              }
            />
          </div>
        </div>

        <Button 
          onClick={handleCalculate} 
          className="w-full h-12 mt-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all"
        >
          Calcular CMV
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </motion.div>
  );
};