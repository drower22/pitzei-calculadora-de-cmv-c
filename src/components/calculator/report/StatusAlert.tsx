
import { AlertCircle } from "lucide-react";

interface StatusAlertProps {
  isHealthy: boolean;
  lucroPerdido: number;
  getAsterisks: (value: number) => string;
}

export const StatusAlert = ({ isHealthy, lucroPerdido, getAsterisks }: StatusAlertProps) => {
  if (isHealthy) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="w-5 h-5 text-green-500" />
          <h2 className="text-lg font-semibold text-green-500">Parabéns!</h2>
        </div>
        <p className="text-green-600 font-medium">
          Sua pizzaria está com um CMV saudável. Continue com o ótimo trabalho!
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle className="w-5 h-5 text-red-500" />
        <h2 className="text-lg font-semibold text-red-500">Atenção!</h2>
      </div>
      <p className="text-red-600 font-medium">
        Sua pizzaria pode estar deixando de lucrar até R$ {getAsterisks(lucroPerdido)} por mês!
      </p>
    </div>
  );
};
