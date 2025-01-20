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
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gradient-to-br from-white to-orange-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex justify-center mb-8">
          <img 
            src="/lovable-uploads/4f4bf946-023c-45f2-9a6c-7de97aae4f70.png" 
            alt="Pitzei Logo" 
            className="h-16 md:h-20 w-auto"
          />
        </div>
        
        {!result ? (
          <Card className="p-6 md:p-8 shadow-lg bg-white/90 backdrop-blur-sm">
            <CalculatorForm onCalculate={handleCalculate} />
          </Card>
        ) : (
          <div className="w-full">
            <ResultReport result={result} onBack={handleBack} />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Calculator;