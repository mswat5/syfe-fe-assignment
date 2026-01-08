import type { Currency, Goal } from "../types/goals";

export const convertCurrency = (
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency,
  exchangeRate: number
): number => {
  if (fromCurrency === toCurrency) return amount;

  if (fromCurrency === 'USD' && toCurrency === 'INR') {
    return amount * exchangeRate;
  }

  if (fromCurrency === 'INR' && toCurrency === 'USD') {
    return amount / exchangeRate;
  }

  return amount;
};

export const formatCurrency = (amount: number, currency: Currency): string => {
  const symbol = currency === 'INR' ? '₹' : '$';
  return `${symbol}${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
};

export const calculateSavedAmount = (goal: Goal): number => {
  return goal.contributions.reduce((sum, contribution) => sum + contribution.amount, 0);
};

export const calculateProgress = (goal: Goal): number => {
  const saved = calculateSavedAmount(goal);
  return goal.totalAmount > 0 ? (saved / goal.totalAmount) * 100 : 0;
};
