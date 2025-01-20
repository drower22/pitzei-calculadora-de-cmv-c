import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";

interface FormData {
  faturamento: number;
  inclui_taxas: boolean;
  taxas_repassadas: number;
  total_compras: number;
  email: string;
}

interface CalculationResult {
  cmv_valor: number;
  cmv_percentual: number;
  lucro_perdido: number;
}

const Calculator = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [formData, setFormData] = useState<FormData>({
    faturamento: 0,
    inclui_taxas: false,
    taxas_repassadas: 0,
    total_compras: 0,
    email: "",
  });
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user?.email) {
        setFormData(prev => ({ ...prev, email: session.user.email }));
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user?.email) {
        setFormData(prev => ({ ...prev, email: session.user.email }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleCalculate = async () => {
    try {
      setLoading(true);
      
      // Validate inputs
      if (!formData.faturamento || !formData.total_compras || !formData.email) {
        toast({
          title: "Erro",
          description: "Por favor, preencha todos os campos obrigatórios.",
          variant: "destructive",
        });
        return;
      }

      // Calculate CMV
      const faturamentoReal = formData.inclui_taxas
        ? formData.faturamento - formData.taxas_repassadas
        : formData.faturamento;

      const cmv_valor = formData.total_compras;
      const cmv_percentual = (formData.total_compras / faturamentoReal) * 100;
      const lucro_perdido = cmv_percentual > 30 
        ? ((cmv_percentual - 30) / 100) * faturamentoReal
        : 0;

      const calculationResult = {
        cmv_valor,
        cmv_percentual,
        lucro_perdido,
      };

      // Save to Supabase
      const { error } = await supabase.from("calculadora_cmv").insert([
        {
          faturamento: formData.faturamento,
          inclui_taxas: formData.inclui_taxas,
          taxas_repassadas: formData.taxas_repassadas,
          total_compras: formData.total_compras,
          email: formData.email,
          cmv_valor,
          cmv_percentual,
          lucro_perdido,
          data_criacao: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      setResult(calculationResult);
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
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto p-6">
          <h2 className="text-2xl font-bold mb-6">Login Necessário</h2>
          <Auth 
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme="light"
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-2xl mx-auto p-6 glass-card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Calculadora de CMV</h2>
            <Button
              variant="outline"
              onClick={() => supabase.auth.signOut()}
            >
              Sair
            </Button>
          </div>
          
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

            <div>
              <Label htmlFor="email">Seu email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <Button
              onClick={handleCalculate}
              className="w-full"
              disabled={loading}
            >
              {loading ? "Calculando..." : "Calcular"}
            </Button>
          </div>

          {result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mt-8 p-6 bg-white rounded-lg shadow-lg"
            >
              <h3 className="text-xl font-bold mb-4">Resultados</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">CMV em valor:</p>
                  <p className="text-lg font-semibold">
                    R$ {result.cmv_valor.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">CMV em percentual:</p>
                  <p className="text-lg font-semibold">
                    {result.cmv_percentual.toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Lucro perdido:</p>
                  <p className="text-lg font-semibold text-destructive">
                    R$ {result.lucro_perdido.toFixed(2)}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    Metodologia: O CMV é calculado dividindo o total de compras pelo
                    faturamento real (descontadas as taxas de entrega, se
                    aplicável). Um CMV saudável deve estar próximo a 30%.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default Calculator;