import React, { useState } from 'react';
import Container from "@/components/ui/Container";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import VerifyLink from '../../components/VerifyLink/VerifyLink';

const ProductCost = ({ authUser, authUserLoading, authUserError }) => {
    const queryClient = useQueryClient();
    const [barcodes, setBarcodes] = useState([{ barcode: '', costPrice: '', sa_name: '' }]);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const { data: existingBarcodes, isLoading } = useQuery({
        queryKey: ['existingBarcodes'],
        queryFn: async () => {
            const res = await axios.get('/api/report/get-existing-barcodes');
            return res.data.barcodes;
        },
        enabled: !!authUser
    });

    const { mutate: saveBarcodes, isPending, isError } = useMutation({
        mutationFn: async (newBarcodes) => {
            try {
                const res = await axios.post('/api/report/save-barcodes', { barcodes: newBarcodes });
                return res.data;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        onSuccess: (data) => {
            setIsSubmitted(true);
            toast.success('Штрих -коды успешно сохранились');
            queryClient.invalidateQueries({ queryKey: ['existingBarcodes'] });
            window.location.reload();
        },
        onError: () => {
            toast.error('Не удалось сохранить штрих -коды');
        }
    });

    const maxBarcodes = authUser?.allowedNumberOfBarcodes || 0;
    const savedBarcodesCount = existingBarcodes?.length || 0;
    const newBarcodesCount = barcodes.filter(item => item.barcode && item.costPrice && item.sa_name).length;
    const remainingSlots = maxBarcodes - (savedBarcodesCount + newBarcodesCount);

    const handleInputChange = (index, e) => {
        const { name, value } = e.target;
        const newBarcodes = [...barcodes];
        newBarcodes[index][name] = value;
        setBarcodes(newBarcodes);
    };

    const handleAddRow = (e) => {
        e.preventDefault();
        const numRowsToAdd = e.shiftKey ? 10 : 1;

        if (barcodes.length + numRowsToAdd > remainingSlots) {
            toast.error(`You can only add up to ${remainingSlots} more barcodes.`);
            return;
        }

        const newRows = Array(numRowsToAdd).fill({ barcode: '', costPrice: '', sa_name: '' });
        setBarcodes([...barcodes, ...newRows]);
    };

    const handleRemoveRow = (index) => {
        const newBarcodes = barcodes.filter((_, i) => i !== index);
        setBarcodes(newBarcodes);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        saveBarcodes(barcodes);
    };

    if (isLoading) return (
        <Container>
            <div className='flex items-center justify-center'>
                <button className="btn ">
                    <span className="loading loading-spinner"></span>
                    Загрузка данных...
                </button>
            </div>
        </Container>
    );

    return (
        <Container>
            {
                (!authUser?.isVerified && !authUserLoading && !authUserError) && <VerifyLink />
            }
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <p>Сохранено баркодов: {savedBarcodesCount}</p>
                    <p>Свободных ячеек: {remainingSlots}</p>
                </div>
                <div className="mb-4">
                    <h3 className="font-bold">Баркоды:</h3>
                    <table className='table'>
                        <thead>
                            <tr className='font-bold text-black text-base'>
                                <th>Число баркода</th>
                                <th>Баркод</th>
                                <th>Стоимость (в руб.)</th>
                                <th>SA Name</th>
                                <th>Действие</th>
                            </tr>
                        </thead>
                        <tbody>
                            {existingBarcodes?.map((item, index) => (
                                <tr key={item._id} className='bg-gray-200 '>
                                    <td>{index + 1}</td>
                                    <td>{item.barcode}</td>
                                    <td>{item.costPrice} руб.</td>
                                    <td>{item.sa_name}</td>
                                    <td>-</td>
                                </tr>
                            ))}
                            {barcodes.map((item, index) => {
                                const isDisabled = existingBarcodes?.some(savedItem => savedItem.barcode === item.barcode);
                                const startingIndex = savedBarcodesCount + index + 1;
                                return (
                                    <tr key={index}>
                                        <td>{startingIndex}</td>
                                        <td>
                                            <input
                                                type="text"
                                                name="barcode"
                                                placeholder='Введите баркод'
                                                value={item.barcode}
                                                className='outline-none border w-full h-full p-2'
                                                onChange={(e) => handleInputChange(index, e)}
                                                required
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                name="costPrice"
                                                placeholder='Введите стоимость'
                                                className='outline-none border w-full h-full p-2'
                                                value={item.costPrice}
                                                onChange={(e) => handleInputChange(index, e)}
                                                required
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                name="sa_name"
                                                placeholder='Введите SA Name'
                                                className='outline-none border w-full h-full p-2'
                                                value={item.sa_name}
                                                onChange={(e) => handleInputChange(index, e)}
                                                required
                                            />
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                className="btn btn-outline btn-error"
                                                onClick={() => handleRemoveRow(index)}>
                                                Удалить
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className='flex justify-between items-center mt-4'>
                    <button
                        type="button"
                        className='btn btn-primary'
                        onClick={handleAddRow}
                        disabled={isPending || barcodes.length >= remainingSlots || isSubmitted}>
                        Добавить строку
                    </button>
                    <button className='btn btn-info btn-wide'
                        type="submit" disabled={isPending || isSubmitted}>Сохранить</button>
                </div>
                {isError &&
                    <div role="alert" className="alert alert-error">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 shrink-0 stroke-current"
                            fill="none"
                            viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Возникла ошибка при сохранении данных.</span>
                    </div>}
            </form>
        </Container>
    );
};

export default ProductCost;
