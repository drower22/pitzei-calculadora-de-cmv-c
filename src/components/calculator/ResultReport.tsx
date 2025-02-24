
import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { CalculationResult } from "./CalculatorForm";
import { StatusAlert } from "./report/StatusAlert";
import { ResultGrid } from "./report/ResultGrid";
import { EmailDialog } from "./report/EmailDialog";
import { getAsterisks } from "./utils/currency";

interface ResultReportProps {
  result: CalculationResult;
  onBack: () => void;
}

export const ResultReport = ({ result, onBack }: ResultReportProps) => {
  const [emailOpen, setEmailOpen] = useState(false);
  const isCMVHealthy = result.cmv_percentual <= 38;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card className="p-6 bg-gradient-to-br from-white to-gray-50">
        <div className="space-y-6">
          <StatusAlert 
            isHealthy={isCMVHealthy} 
            lucroPerdido={result.lucro_perdido}
            getAsterisks={getAsterisks}
          />

          <ResultGrid 
            result={result}
            isCMVHealthy={isCMVHealthy}
          />

          <div className="flex justify-center">
            <Button
              onClick={() => setEmailOpen(true)}
              className="bg-brand-orange hover:bg-brand-orange/90 text-white mt-6 w-full md:w-1/2"
            >
              Ver resultado completo
            </Button>
          </div>

          <Accordion type="single" collapsible className="mt-4">
            <AccordionItem value="calculation" className="border-none">
              <AccordionTrigger className="text-sm text-gray-500 hover:text-gray-700 hover:no-underline py-2">
                Como o CMV é calculado?
              </AccordionTrigger>
              <AccordionContent className="text-xs text-gray-600 leading-relaxed">
                O CMV (Custo da Mercadoria Vendida) é calculado dividindo o total de compras pelo faturamento real e multiplicando por 100 para obter a porcentagem.
                <br /><br />
                Fórmula: CMV = (Total de Compras ÷ Faturamento Real) × 100
                <br /><br />
                Para o setor de pizzarias, um CMV saudável deve estar em torno de 38%. Valores acima disso indicam que sua operação pode estar perdendo lucratividade.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </Card>

      <EmailDialog
        open={emailOpen}
        onOpenChange={setEmailOpen}
        result={result}
        onSuccess={onBack}
      />
    </motion.div>
  );
};
