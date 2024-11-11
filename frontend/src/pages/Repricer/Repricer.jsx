import React, { useState } from 'react';
import Container from "@/components/ui/Container";
import { useFetchUser, useFetchUserBarcodes } from '@/store/useUserStore.js';
import RepricerAddProductModal from '@/components/Modals/RepricerAddProductModal';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import LoadingPage from '@/components/LoadingPage/LoadingPage';
import toast from 'react-hot-toast';
import { useFetchProducts } from '@/store/useProductsState.js';  // Import the hook

const Repricer = () => {
    const queryClient = useQueryClient();
    const { data: authUser, isLoading: isLoadingUser, isError: isUserError, error: userError } = useFetchUser();
    const { barcodes: userBarcodes, isLoading: isLoadingBarcodes, error: barcodesError } = useFetchUserBarcodes();

    const [editedProducts, setEditedProducts] = useState({});
    const repriceData = authUser?.repricingData;
    const { productsData, isLoading: isLoadingProducts, error: productsError } = useFetchProducts(authUser?.apiKeys?.repriceApiKey);


    const filteredProductsData = productsData?.filter(product =>
        authUser?.repricingData.some(userBarcode => userBarcode.barcode === product.barcode)
    ) || [];
  
    const aggregatedData = filteredProductsData.reduce((acc, product) => {
        const { barcode, quantity, supplierArticle, brand, subject, Price, Discount } = product;
        if (!acc[barcode]) {
            acc[barcode] = { barcode, supplierArticle, brand, subject, Price, Discount, totalQuantity: 0 };
        }
        acc[barcode].totalQuantity += quantity;
        return acc;
    }, {});

    const aggregatedProducts = Object.values(aggregatedData).sort((a, b) => a.barcode.localeCompare(b.barcode));

    const mergedData = aggregatedProducts.map(product => {
        const userBarcode = repriceData?.find(item => item.barcode === product.barcode);

        return {
            ...product,
            threshold: userBarcode?.threshold || '',
            changeRatio: userBarcode?.changeRatio || '',
        };
    });

    const handleInputChange = (barcode, field, value) => {
        setEditedProducts(prev => ({
            ...prev,
            [barcode]: {
                ...prev[barcode],
                [field]: value,
            },
        }));
    };

    const { mutate: updateRepriceData } = useMutation({
        mutationFn: async ({ barcode, threshold, changeRatio }) => {
            const res = await axios.post('/api/reprice/update-product-reprice', { barcode, threshold, changeRatio });
            return res.data;
        },
        onSuccess: () => {
            toast.success('Данные успешно сохранены!')
            queryClient.invalidateQueries(['productsData']);
        },
        onError: (error) => {
            toast.error('Возникла ошибка при сохранении данных!')
            console.error("Error updating reprice data:", error);
        }
    });

    const handleSaveClick = (product) => {
        const editedProduct = editedProducts[product.barcode] || {};
        const threshold = editedProduct.threshold !== undefined ? editedProduct.threshold : product.threshold;
        const changeRatio = editedProduct.changeRatio !== undefined ? editedProduct.changeRatio : product.changeRatio;

        updateRepriceData({ barcode: product.barcode, threshold, changeRatio });
    };

    const hasChanges = (product) => {
        const editedProduct = editedProducts[product.barcode] || {};
        const isThresholdChanged = editedProduct.threshold !== undefined && editedProduct.threshold !== product.threshold;
        const isChangeRatioChanged = editedProduct.changeRatio !== undefined && editedProduct.changeRatio !== product.changeRatio;

        return isThresholdChanged || isChangeRatioChanged;
    };

    // Добавление функции для удаления продукта
    const { mutate: deleteProduct } = useMutation({
        mutationFn: async (barcode) => {
            await axios.delete(`/api/reprice/delete-product-reprice/${barcode}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['productsData']);
        },
        onError: (error) => {
            console.error("Error deleting product:", error);
        }
    });

    const handleDeleteClick = (barcode) => {
        deleteProduct(barcode);
    };

    if (isLoadingUser || isLoadingBarcodes || isLoadingProducts) return <p><LoadingPage /></p>;
    if (isUserError) return <p>Error: {userError.message}</p>;
    if (barcodesError) return <p>Error: {barcodesError.message}</p>;
    if (productsError) return <p>Error loading products data.</p>;

    return (
        <Container>
            <div className='mt-20'>
                <div className='w-full flex justify-end'>
                    <button className='btn btn-neutral' onClick={() => document.getElementById('my_modal_3').showModal()}>
                        Добавить товар
                    </button>
                </div>
                <div>
                    <h3>На складах найдено</h3>
                    <table className="table-auto w-full mt-4">
                        <thead>
                            <tr>
                                <th className="px-4 py-2">Товар</th>
                                <th className="px-4 py-2">Текущая Цена</th>
                                <th className="px-4 py-2">Скидка</th>
                                <th className="px-4 py-2">Порог</th>
                                <th className="px-4 py-2">Коэффициент изменений</th>
                                <th className="px-4 py-2">Будущая цена</th>
                                <th className="px-4 py-2">Общее количество</th>
                                <th className="px-4 py-2">Действия</th>
                            </tr>
                        </thead>
                        <tbody className=''>
                            {mergedData.map((product) => (
                                <tr key={product.barcode} className=''>
                                    <td className="border px-4 py-2" >
                                        <div>
                                            <div4>Штрих-код: {product.barcode}</div4>
                                            <div>Наименование: {product.supplierArticle}</div>
                                            <div>Бренд: {product.brand}</div>
                                            <div>Предмет: {product.subject}</div>
                                        </div>
                                    </td>
                                    <td className="border px-4 py-2">{product.Price} ₽</td>
                                    <td className="border px-4 py-2">{product.Discount}%</td>
                                    <td className="border px-4 py-2">
                                        <div className="input-container">
                                            <input
                                                type="number"
                                                value={editedProducts[product.barcode]?.threshold ?? product.threshold}
                                                onChange={(e) => handleInputChange(product.barcode, 'threshold', e.target.value)}
                                                className="input input-bordered w-full input-with-unit"
                                            />
                                            <span className="unit-label">Шт</span>
                                        </div>
                                    </td>
                                    <td className="border px-4 py-2">
                                        <input
                                            type="number"
                                            value={editedProducts[product.barcode]?.changeRatio ?? product.changeRatio}
                                            onChange={(e) => handleInputChange(product.barcode, 'changeRatio', e.target.value)}
                                            className="input input-bordered w-full"
                                        />
                                    </td>
                                    <td className="border px-4 py-2">{(product.Price * (1 + product.changeRatio / 100)).toFixed(2)}</td>
                                    <td className="border px-4 py-2">{product.totalQuantity}</td>
                                    <td className="border px-4 py-2 gap-2 flex items-center h-full justify-center flex-col">
                                        <button
                                            className="btn btn-primary w-full"
                                            onClick={() => handleSaveClick(product)}
                                            disabled={!hasChanges(product)}
                                        >
                                            Сохранить
                                        </button>
                                        <button
                                            className="btn btn-error w-full"
                                            onClick={() => handleDeleteClick(product.barcode)}
                                        >
                                            Удалить
                                        </button>
                                    </td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
                <RepricerAddProductModal authUser={authUser} userBarcodes={userBarcodes} />
            </div>
        </Container>
    );
};

export default Repricer;
