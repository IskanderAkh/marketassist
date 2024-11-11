// hooks/useRepricerData.js
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useFetchUser, useFetchUserBarcodes } from '@/store/useUserStore';

export const useRepricerData = () => {
    const queryClient = useQueryClient();
    const { data: authUser, isLoading: isLoadingUser, error: userError } = useFetchUser();
    const { barcodes: userBarcodes, isLoading: isLoadingBarcodes, error: barcodesError } = useFetchUserBarcodes();
    const [editedProducts, setEditedProducts] = useState({});

    const { data: productsData, isLoading: isLoadingProducts, error: productsError } = useQuery({
        queryKey: ['productsData', authUser?.apiKeys?.repriceApiKey],
        queryFn: async () => {
            const res = await axios.get('/api/reprice/get-products');
            return res.data.response;
        },
        enabled: !!authUser?.apiKeys?.repriceApiKey,
        refetchOnWindowFocus: false,
    });

    const filteredProductsData = productsData?.filter(product =>
        authUser?.repricingData.some(userBarcode => userBarcode.barcode === product.barcode)
    ) || [];

    const aggregatedData = filteredProductsData.reduce((acc, product) => {
        const { barcode, quantity, SCCode, brand, subject, Price, Discount } = product;
        if (!acc[barcode]) {
            acc[barcode] = { barcode, SCCode, brand, subject, Price, Discount, totalQuantity: 0 };
        }
        acc[barcode].totalQuantity += quantity;
        return acc;
    }, {});

    const aggregatedProducts = Object.values(aggregatedData).sort((a, b) => a.barcode.localeCompare(b.barcode));

    const mergedData = aggregatedProducts.map(product => {
        const userBarcode = authUser?.repricingData?.find(item => item.barcode === product.barcode);
        return {
            ...product,
            threshold: userBarcode?.threshold || '',
            changeRatio: userBarcode?.changeRatio || '',
        };
    });

    const updateRepriceData = useMutation({
        mutationFn: async ({ barcode, threshold, changeRatio }) => {
            await axios.post('/api/reprice/update-product-reprice', { barcode, threshold, changeRatio });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['productsData']);
        },
    });

    const deleteProduct = useMutation({
        mutationFn: async (barcode) => {
            await axios.delete(`/api/reprice/delete-product-reprice/${barcode}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['productsData']);
        },
    });

    return {
        authUser,
        userBarcodes,
        productsData: mergedData,
        editedProducts,
        setEditedProducts,
        isLoading: isLoadingUser || isLoadingBarcodes || isLoadingProducts,
        errors: { userError, barcodesError, productsError },
        updateRepriceData,
        deleteProduct,
    };
};
