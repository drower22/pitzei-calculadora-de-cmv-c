import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { CalculatorForm, type CalculationResult } from "@/components/calculator/CalculatorForm";
import { ResultReport } from "@/components/calculator/ResultReport";

const Calculator = () => {
  const [result, setResult] = useState<CalculationResult | null>(null);

  const handleCalculate = (calculationResult: CalculationResult) => {
    setResult(calculationResult);
  };

  const handleBack = () => {
    setResult(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {!result ? (
          <Card className="max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Calculadora de CMV</h2>
            <CalculatorForm onCalculate={handleCalculate} />
          </Card>
        ) : (
          <div className="max-w-3xl mx-auto">
            <ResultReport result={result} onBack={handleBack} />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Calculator;