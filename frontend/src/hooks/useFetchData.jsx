import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchData = (apiKey, fetchData) => {
    const url = 'https://statistics-api.wildberries.ru/api/v5/supplier/reportDetailByPeriod';
    const params = {
        dateFrom: '2024-05-01',
        dateTo: '2024-05-30',
        rrdid: ''
    };

    const { data, isLoading } = useQuery({
        queryKey: ['sold', fetchData],
        queryFn: async () => {
            if (!fetchData) return;
            try {
                const res = await axios.get(url, {
                    headers: {
                        'Authorization': apiKey,
                        'Content-Type': 'application/json'
                    },
                    params: params
                });
                console.log(res.data);
                return res.data;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        enabled: fetchData,
    });

    const [groupedData, setGroupedData] = useState([]);

    useEffect(() => {
        if (data) {
            const grouped = data.reduce((acc, item) => {
                const barcode = item.barcode;
                if (item.supplier_oper_name === "Логистика") {
                    if (!acc[barcode]) {
                        acc[barcode] = {
                            barcode,
                            totalPrice: 0,
                            productCost: 0,
                            quantity: 0,
                            logisticsCost: 0,
                            checkingAccount: 0,
                            nm_id: 0,
                        };
                    }
                    item.delivery_rub > 0
                        ? acc[barcode].logisticsCost += Number(item.delivery_rub)
                        : acc[barcode].logisticsCost += Number(item.delivery_rub * -1);

                } else if (item.supplier_oper_name === "Продажа") {
                    if (!acc[barcode]) {
                        acc[barcode] = {
                            barcode,
                            totalPrice: 0,
                            productCost: 0,
                            quantity: 0,
                            logisticsCost: 0,
                            checkingAccount: 0,
                            nm_id: 0,
                        };
                    }

                    acc[barcode].totalPrice += Number(item.retail_amount);
                    acc[barcode].quantity += Number(item.quantity);
                    acc[barcode].checkingAccount += Number(item.retail_amount)
                        - acc[barcode].logisticsCost
                        - (Number(item.retail_amount) * 0.07);
                    acc[barcode].nm_id = item.nm_id;
                }

                return acc;
            }, {});
            console.log(grouped);
            setGroupedData(Object.values(grouped));
        }
    }, [data]);

    const handleCostChange = (barcode, cost) => {
        setGroupedData(prevData =>
            prevData.map(item =>
                item.barcode === barcode
                    ? {
                        ...item,
                        productCost: Number(cost),
                        checkingAccount: item.totalPrice 
                            - item.logisticsCost
                            - (item.totalPrice * 0.07)
                            - (Number(cost) * item.quantity)
                    }
                    : item
            )
        );
    };

    return { data, isLoading, groupedData, handleCostChange };
};

export default useFetchData;
