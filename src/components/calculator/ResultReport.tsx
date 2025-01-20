import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { CalculationResult } from "./CalculatorForm";

interface ResultReportProps {
  result: CalculationResult;
  onBack: () => void;
}

export const ResultReport = ({ result, onBack }: ResultReportProps) => {
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">Relatório de CMV</h3>
          <p className={`text-lg font-semibold ${getStatusColor(result.cmv_percentual)}`}>
            {getStatusMessage(result.cmv_percentual)}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Faturamento Real</p>
            <p className="text-lg font-semibold">
              {formatCurrency(result.faturamento_real)}
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">CMV em Valor</p>
            <p className="text-lg font-semibold">
              {formatCurrency(result.cmv_valor)}
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">CMV Percentual</p>
            <p className="text-lg font-semibold">
              {result.cmv_percentual.toFixed(2)}%
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Lucro Perdido</p>
            <p className="text-lg font-semibold text-destructive">
              {formatCurrency(result.lucro_perdido)}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold mb-2">Análise</h4>
            <p className="text-sm">
              O CMV (Custo da Mercadoria Vendida) ideal para o setor é de 38%. 
              {result.cmv_percentual > 38 ? (
                ` Seu CMV está ${(result.cmv_percentual - 38).toFixed(1)}% acima do ideal, 
                resultando em uma perda de ${formatCurrency(result.lucro_perdido)} em lucro potencial.`
              ) : (
                " Parabéns! Seu CMV está dentro ou abaixo do ideal para o setor."
              )}
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">Recomendações</h4>
            <ul className="text-sm space-y-2">
              <li>• Revise seus fornecedores e busque melhores preços</li>
              <li>• Controle o desperdício de insumos</li>
              <li>• Otimize seu mix de produtos</li>
              <li>• Monitore seus custos de forma consistente</li>
            </ul>
          </div>
        </div>

        <Button onClick={onBack} className="w-full">
          Calcular Novamente
        </Button>
      </Card>
    </motion.div>
  );
};