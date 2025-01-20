import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";

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
    <div className="space-y-6">
      <div>
        <Label htmlFor="faturamento">Faturamento total do último mês</Label>
        <Input
          id="faturamento"
          type="number"
          placeholder="R$ 0,00"
          value={formData.faturamento || ""}
          onChange={(e) =>
            setFormData({ ...formData, faturamento: Number(e.target.value) })
          }
        />
      </div>

      <div>
        <Label>Inclui taxas de entrega?</Label>
        <RadioGroup
          value={formData.inclui_taxas ? "yes" : "no"}
          onValueChange={(value) =>
            setFormData({ ...formData, inclui_taxas: value === "yes" })
          }
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
        <div>
          <Label htmlFor="taxas">Total repassado em taxas</Label>
          <Input
            id="taxas"
            type="number"
            placeholder="R$ 0,00"
            value={formData.taxas_repassadas || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                taxas_repassadas: Number(e.target.value),
              })
            }
          />
        </div>
      )}

      <div>
        <Label htmlFor="compras">Total de compras do último mês</Label>
        <Input
          id="compras"
          type="number"
          placeholder="R$ 0,00"
          value={formData.total_compras || ""}
          onChange={(e) =>
            setFormData({ ...formData, total_compras: Number(e.target.value) })
          }
        />
      </div>

      <Button onClick={handleCalculate} className="w-full">
        Calcular
      </Button>
    </div>
  );
};