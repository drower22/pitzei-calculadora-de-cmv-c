
export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const getAsterisks = (value: number) => {
  const numDigits = Math.floor(value).toString().length;
  return "*".repeat(numDigits);
};
