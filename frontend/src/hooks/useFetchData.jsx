import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const useFetchData = (apiKey, fetchData, dateFrom, dateTo) => {
    const url = '/api/report/report-detail'; // Backend endpoint

    const { data, isLoading } = useQuery({
        queryKey: ['sold', apiKey, fetchData, dateFrom, dateTo],
        queryFn: async () => {
            if (!fetchData || !apiKey || !dateFrom || !dateTo) return [];
            try {
                const res = await axios.post(url, {
                    apiKey,
                    dateFrom,
                    dateTo,
                });
                return res.data;
            } catch (error) {
                console.error('Error fetching data:', error);
                throw error;
            }
        },
        enabled: fetchData && !!apiKey && !!dateFrom && !!dateTo,
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
                    acc[barcode].logisticsCost += Math.abs(Number(item.delivery_rub));

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
                    acc[barcode].checkingAccount +=
                        Number(item.retail_amount) -
                        acc[barcode].logisticsCost -
                        Number(item.retail_amount) * 0.07;
                    acc[barcode].nm_id = item.nm_id;
                }

                return acc;
            }, {});
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
                        checkingAccount:
                            item.totalPrice -
                            item.logisticsCost -
                            item.totalPrice * 0.07 -
                            Number(cost) * item.quantity,
                    }
                    : item
            )
        );
    };
    const handleFileUpload = (file) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            // Extract barcode and cost price
            const extractedData = jsonData.slice(1).map(row => {
                const barcode = row[0];
                let costPrice = row[1];
                console.log(barcode, "=", costPrice);

                // Ensure costPrice is a string before trying to replace
                if (typeof costPrice === 'number') {
                    costPrice = costPrice.toFixed(2);
                } else if (typeof costPrice === 'string') {
                    costPrice = costPrice.replace(',', '.');
                } else {
                    costPrice = null;
                }

                return {
                    barcode,
                    costPrice: parseFloat(costPrice)
                };
            });

            // Update the table with the new cost prices
            extractedData.forEach(({ barcode, costPrice }) => {
                if (!isNaN(costPrice)) {
                    handleCostChange(barcode, costPrice);
                }
            });
        };

        reader.readAsArrayBuffer(file);
    };
    return { data, isLoading, groupedData, handleCostChange, handleFileUpload };
};

export default useFetchData;
