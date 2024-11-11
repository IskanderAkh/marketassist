import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (barcode) => {
            await axios.delete(`/api/reprice/delete-product-reprice/${barcode}`);
        },
        onSuccess: () => {
            toast.success('Продукт успешно удалён!');
            queryClient.invalidateQueries(['productsData']);
        },
        onError: (error) => {
            toast.error('Ошибка при удалении продукта');
            console.error("Error deleting product:", error);
        }
    });
};
