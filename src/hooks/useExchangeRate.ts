import { useQuery } from '@tanstack/react-query';

const BASE_URL = `https://v6.exchangerate-api.com/v6/${import.meta.env.VITE_EXCHANGE_API_KEY}/latest/USD`;

export const useExchangeRate = () => {
  return useQuery({
    queryKey: ['exchangeRate'],
    queryFn: async () => {
      const response = await fetch(BASE_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rate');
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 60, 
    refetchOnWindowFocus: false,
  });
};
