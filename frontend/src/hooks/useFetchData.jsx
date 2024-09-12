import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const useFetchData = (apiKey, fetchData, dateFrom, dateTo) => {
    const url = '/api/report/report-detail';
    const barcodesUrl = '/api/user/barcodes'; 

    const{data: allowedBarcodes, isLoading: isLoadingBarcodes} = useQuery({
        queryKey: ['barcodes'],
        queryFn: async () => {
            const res = await axios.get(barcodesUrl);
            return res.data;
        }
    })

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
        if (data && allowedBarcodes) {
            const grouped = data.reduce((acc, item) => {
                const barcode = item.barcode;
                const allowedBarcode = allowedBarcodes.find(b => b.barcode === barcode);

                if (allowedBarcode) {
                    if (!acc[barcode]) {
                        acc[barcode] = {
                            barcode,
                            totalPrice: 0,
                            productCost: allowedBarcode.costPrice || 0, // Set initial costPrice from allowed barcodes
                            quantity: 0,
                            logisticsCost: 0,
                            checkingAccount: 0,
                            nm_id: 0,
                        };
                    }

                    if (item.supplier_oper_name === "Логистика") {
                        acc[barcode].logisticsCost += Math.abs(Number(item.delivery_rub));
                    } else if (item.supplier_oper_name === "Продажа") {
                        acc[barcode].totalPrice += Number(item.retail_amount);
                        acc[barcode].quantity += Number(item.quantity);
                        acc[barcode].checkingAccount =
                            acc[barcode].totalPrice -
                            acc[barcode].logisticsCost -
                            acc[barcode].totalPrice * 0.07 -
                            acc[barcode].productCost * acc[barcode].quantity;
                        acc[barcode].nm_id = item.nm_id;
                    }
                }
                return acc;
            }, {});

            setGroupedData(Object.values(grouped));
        }
    }, [data, allowedBarcodes]);

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

            const extractedData = jsonData.slice(1).map(row => {
                const barcode = row[0];
                let costPrice = row[1];
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
