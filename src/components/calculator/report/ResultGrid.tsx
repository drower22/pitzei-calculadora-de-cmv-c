
import { DollarSign, PieChart } from "lucide-react";
import { formatCurrency } from "../utils/currency";
import type { CalculationResult } from "../CalculatorForm";

interface ResultGridProps {
  result: CalculationResult;
  isCMVHealthy: boolean;
}

export const ResultGrid = ({ result, isCMVHealthy }: ResultGridProps) => {
  return (
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
  );
};
