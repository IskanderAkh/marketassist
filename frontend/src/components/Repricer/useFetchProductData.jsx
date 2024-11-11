import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useFetchProductsData = (apiKey) => {
    return useQuery(['productsData', apiKey], async () => {
        if (apiKey) {
            const res = await axios.get('/api/reprice/get-products');
            return res.data.response;
        }
    }, { enabled: !!apiKey });
};
