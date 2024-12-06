// useProductsState.js

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useFetchProducts = () => {
  return useQuery({
    queryKey: ['productsData'],
    queryFn: async () => {
      const response = await axios.get('/api/reprice/get-products');
      return response.data.products;
    },
  });
};
