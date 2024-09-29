import { useMutation, useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const useFetchData = (apiKey, fetchData, dateFrom, dateTo) => {
    const [data, setData] = useState([])
    const [filteredItems, setFilteredItems] = useState([]);
    const [logisticsCount, setLogisticsCount] = useState(0);
    const url = '/api/report/report-detail';
    const barcodesUrl = '/api/user/barcodes';

    const { data: allowedBarcodes, isLoading: isLoadingBarcodes } = useQuery({
        queryKey: ['barcodes'],
        queryFn: async () => {
            const res = await axios.get(barcodesUrl);
            return res.data;
        }
    })

    const { mutate: getData, isLoading } = useMutation({
        mutationKey: ['sold', apiKey, fetchData, dateFrom, dateTo],
        mutationFn: async () => {

            if (!apiKey || !dateFrom || !dateTo) return [];
            try {
                const res = await axios.post(url, {
                    apiKey,
                    dateFrom,
                    dateTo,
                });
                setData(res.data);
                return res.data;
            } catch (error) {
                console.error('Error fetching data:', error);
                throw error;
            }
        },
        enabled: fetchData && !!apiKey && !!dateFrom && !!dateTo,
        cacheTime: 0
    });

    const [groupedData, setGroupedData] = useState([]);

    useEffect(() => {
        if (data && allowedBarcodes) {
            const barcodeMapping = {};

            allowedBarcodes.forEach(barcodeItem => {
                if (barcodeItem.sa_name) {
                    barcodeMapping[barcodeItem.sa_name] = barcodeItem.barcode;
                }
            });

            const allowedBarcodesSet = new Set(allowedBarcodes.map(item => item.barcode));
            const combinedGroupedData = {};
            const filtered = [];
            let logisticsSum = 0;

            data.forEach(item => {
                const barcode = item.barcode;
                const saName = item.sa_name;
                
                if (barcode && allowedBarcodesSet.has(barcode)) {
                    if (!combinedGroupedData[barcode]) {
                        combinedGroupedData[barcode] = {
                            barcode,
                            totalPrice: 0,
                            productCost: allowedBarcodes.find(b => b.barcode === barcode)?.costPrice || 0,
                            quantity: 0,
                            logisticsCost: 0,
                            compensation: 0,
                            checkingAccount: 0,
                            nm_id: item.nm_id,
                        };
                    }

                    if (item.supplier_oper_name === "Логистика") {
                        combinedGroupedData[barcode].logisticsCost += Math.abs(Number(item.delivery_rub));
                    } else if (item.supplier_oper_name === "Продажа") {
                        combinedGroupedData[barcode].totalPrice += Number(item.retail_amount);
                        combinedGroupedData[barcode].quantity += Number(item.quantity);
                        combinedGroupedData[barcode].checkingAccount =
                            combinedGroupedData[barcode].totalPrice -
                            combinedGroupedData[barcode].logisticsCost -
                            combinedGroupedData[barcode].totalPrice * 0.07 -
                            combinedGroupedData[barcode].productCost * combinedGroupedData[barcode].quantity;
                    }
                    else if (item.supplier_oper_name.includes("Возмещение издержек по перевозке") ||
                        item.supplier_oper_name.includes("по складским операциям с товаром")) {
                        combinedGroupedData[barcode].compensation += Math.abs(Number(item.rebill_logistic_cost));
                    }
                    else if (item.supplier_oper_name.includes("Возврат")) {
                        combinedGroupedData[barcode].compensation += Math.abs(Number(item.ppvz_for_pay));
                    }
                }
                else if (saName && barcodeMapping[saName]) {
                    const generatedBarcode = barcodeMapping[saName];

                    if (allowedBarcodesSet.has(generatedBarcode)) {
                        if (!combinedGroupedData[generatedBarcode]) {
                            combinedGroupedData[generatedBarcode] = {
                                barcode: generatedBarcode,
                                totalPrice: 0,
                                productCost: allowedBarcodes.find(b => b.barcode === generatedBarcode)?.costPrice || 0,
                                quantity: 0,
                                logisticsCost: 0,
                                checkingAccount: 0,
                                nm_id: item.nm_id,
                            };
                        }

                        if (item.supplier_oper_name === "Логистика") {
                            combinedGroupedData[generatedBarcode].logisticsCost += Math.abs(Number(item.delivery_rub));
                        } else if (item.supplier_oper_name === "Продажа") {
                            combinedGroupedData[generatedBarcode].totalPrice += Number(item.retail_amount);
                            combinedGroupedData[generatedBarcode].quantity += Number(item.quantity);
                            combinedGroupedData[generatedBarcode].checkingAccount =
                                combinedGroupedData[generatedBarcode].totalPrice -
                                combinedGroupedData[generatedBarcode].logisticsCost -
                                combinedGroupedData[generatedBarcode].totalPrice * 0.07 -
                                combinedGroupedData[generatedBarcode].productCost * combinedGroupedData[generatedBarcode].quantity;
                        }
                        else if (item.supplier_oper_name.includes("Возмещение издержек по перевозке") ||
                            item.supplier_oper_name.includes("по складским операциям с товаром")) {
                            combinedGroupedData[generatedBarcode].compensation += Math.abs(Number(item.rebill_logistic_cost));
                        }
                        else if (item.supplier_oper_name.includes("Возврат")) {
                            combinedGroupedData[barcode].compensation += Math.abs(Number(item.ppvz_for_pay));
                        }
                    }
                    combinedGroupedData[generatedBarcode].quantity + 1
                }
            });
            setGroupedData(Object.values(combinedGroupedData));

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

    return { data, isLoading, groupedData, handleCostChange, handleFileUpload, getData };
};

export default useFetchData;
