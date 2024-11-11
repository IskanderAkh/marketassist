import { useEffect } from 'react';
import { create } from 'zustand';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Define the Zustand store for products
export const useProductsStore = create((set) => ({
    productsData: [],
    cachedProductsData: null, // New property for cached data
    isLoadingProducts: true,
    productsError: null,
    setProductsData: (data) => set({ productsData: data, cachedProductsData: data, isLoadingProducts: false, productsError: null }),
    setProductsError: (error) => set({ productsError: error, isLoadingProducts: false }),
}));

// Function to fetch products data
const fetchProductsData = async (apiKey) => {
    if (!apiKey) return [];
    const response = await axios.get('/api/reprice/get-products', { headers: { Authorization: `Bearer ${apiKey}` } });
    return response.data.response;
};

// Custom hook to fetch products data and set it in Zustand store
export const useFetchProducts = (apiKey) => {
    const { setProductsData, setProductsError, cachedProductsData } = useProductsStore();

    const { data, isLoading, error } = useQuery({
        queryKey: ['productsData', apiKey],
        queryFn: () => fetchProductsData(apiKey),
        enabled: !!apiKey,
    });

    // Effect to handle success and errors
    useEffect(() => {
        if (data) {
            setProductsData(data); // Set the products data if fetched successfully
        }
        if (error) {
            if (error.response && error.response.status === 429) {
                console.warn('Too many requests, returning cached products data.');
                setProductsData(cachedProductsData); // Use cached data on 429 error
            } else {
                setProductsError(error.message); // Handle other errors
                console.error('Error fetching products data:', error);
            }
        }
    }, [data, error, setProductsData, setProductsError, cachedProductsData]);
    
    return { productsData: data || cachedProductsData, isLoading, error };
};
