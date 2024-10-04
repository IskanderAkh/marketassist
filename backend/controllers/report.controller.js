import axios from 'axios';
import User from '../models/user.model.js';

export const getReportDetailByPeriod = async (req, res) => {
    try {
        const { apiKey, dateFrom, dateTo } = req.body;
        const userId = req.user._id;
        const user = await User.findById(userId);
        const allowedBarcodes = user?.barcodes || [];

        if (!user) {
            return res.status(404).json({ error: "Пользователь не найден" });
        }
        const response = await axios.get('https://statistics-api.wildberries.ru/api/v5/supplier/reportDetailByPeriod', {
            headers: {
                'Authorization': apiKey,
                'Content-Type': 'application/json'
            },
            params: {
                dateFrom,
                dateTo,
            },
            timeout: 5000

        });

        const data = response.data;

        const calculatedData = processReportData(data, allowedBarcodes);

        res.json(calculatedData);
    } catch (error) {
        console.error('Error in getReportDetailByPeriod:', error);
        res.status(500).json({ error: 'Error fetching report details' });
    }
};

// Вспомогательная функция: создание маппинга штрихкодов
const createBarcodeMapping = (allowedBarcodes) => {
    const barcodeMapping = {};
    allowedBarcodes.forEach(barcodeItem => {
        if (barcodeItem.sa_name) {
            barcodeMapping[barcodeItem.sa_name] = barcodeItem.barcode;
        }
    });
    return barcodeMapping;
};

// Вспомогательная функция: инициализация данных по штрихкоду
const initializeBarcodeData = (barcode, saName, allowedBarcodes, item) => {
    const productCost = allowedBarcodes.find(b => b.barcode === barcode)?.costPrice || 0;
    return {
        barcode,
        saName,
        totalPrice: 0,
        productCost,
        quantity: 0,
        logisticsCost: 0,
        compensation: 0,
        checkingAccount: 0,
        acquiringAdjustments: 0,
        salesAdjustment: 0,
        compensationForDamages: 0,
        penalty: 0,
        nm_id: item.nm_id,
    };
};

// Вспомогательная функция: обновление данных по операции
const updateBarcodeDataByOperation = (item, barcodeData) => {
    switch (item.supplier_oper_name) {
        case "Логистика":
            barcodeData.logisticsCost += Math.abs(Number(item.delivery_rub));
            break;
        case "Продажа":
            barcodeData.totalPrice += Number(item.retail_amount);
            barcodeData.quantity += Number(item.quantity);
            barcodeData.checkingAccount = barcodeData.totalPrice -
                barcodeData.logisticsCost -
                barcodeData.totalPrice * 0.07 -
                barcodeData.productCost * barcodeData.quantity;
            break;
        default:
            if (item.supplier_oper_name.includes("Возмещение издержек по перевозке") ||
                item.supplier_oper_name.includes("по складским операциям с товаром")) {
                barcodeData.compensation += Math.abs(Number(item.rebill_logistic_cost));
            } else if (item.supplier_oper_name.includes("Возврат")) {
                barcodeData.compensation += Math.abs(Number(item.ppvz_for_pay));
            } else if (item.supplier_oper_name.includes("Компенсация ущерба")) {
                barcodeData.compensationForDamages += Number(item.ppvz_for_pay);
            } else if (item.supplier_oper_name.includes("Коррекция продаж")) {
                barcodeData.salesAdjustment += Number(item.ppvz_for_pay);
            } else if (item.supplier_oper_name.includes("Корректировка эквайринга")) {
                barcodeData.acquiringAdjustments += Number(item.ppvz_for_pay);
            } else if (item.supplier_oper_name.includes("Штраф") || item.supplier_oper_name.includes("Штрафы и доплаты")) {
                barcodeData.penalty += Number(item.penalty);
            }
    }

};

const processReportData = (data, allowedBarcodes) => {
    const barcodeMapping = createBarcodeMapping(allowedBarcodes);
    const allowedBarcodesSet = new Set(allowedBarcodes.map(item => item.barcode));

    const supplierOperNamesSet = new Set();
    const combinedGroupedData = {};

    let recalculationOfPaidAcceptance = 0;
    let storage = 0;
    let retention = 0;

    data.forEach(item => {
        const barcode = item.barcode;
        const saName = item.sa_name;

        if (item.supplier_oper_name.includes("Пересчет платной приемки")) {
            recalculationOfPaidAcceptance += Number(item.acceptance) || 0;
            return;
        }

        if (item.supplier_oper_name.includes("Удержание") || item.supplier_oper_name.includes("Удержания")) {
            retention += Number(item.deduction) || 0;
            return;
        }

        if (item.supplier_oper_name.includes("Хранение")) {
            storage += Number(item.storage_fee) || 0;
            return;
        }

        if (!supplierOperNamesSet.has(item.supplier_oper_name)) {
            supplierOperNamesSet.add(item.supplier_oper_name);
        }

        const processBarcode = (barcodeToProcess) => {
            if (!combinedGroupedData[barcodeToProcess]) {
                combinedGroupedData[barcodeToProcess] = initializeBarcodeData(barcodeToProcess, saName, allowedBarcodes, item);
            }
            updateBarcodeDataByOperation(item, combinedGroupedData[barcodeToProcess]);
        };

        if (barcode && allowedBarcodesSet.has(barcode)) {
            processBarcode(barcode);
        } else if (saName && barcodeMapping[saName]) {
            const generatedBarcode = barcodeMapping[saName];
            if (allowedBarcodesSet.has(generatedBarcode)) {
                processBarcode(generatedBarcode);
            }
        }
    });

    return {
        combinedData: Object.values(combinedGroupedData),
        recalculationOfPaidAcceptance,
        storage,
        retention,
    };
};



export const saveBarcodes = async (req, res) => {
    const { barcodes } = req.body;


    if (!barcodes || barcodes.length === 0) {
        return res.status(400).json({ message: "Barcodes are required" });
    }
    for (const item of barcodes) {
        if (!item.barcode || !item.costPrice || !item.sa_name) {
            return res.status(400).json({ message: "Each barcode must include barcode, costPrice, and sa_name" });
        }
    }

    try {
        const user = await User.findById(req.user.id);

        if (user.barcodes.length + barcodes.length > user.allowedNumberOfBarcodes) {
            return res.status(403).json({ message: "You have exceeded your allowed number of barcodes" });
        }

        const updatedBarcodes = barcodes.map(item => ({
            barcode: item.barcode,
            costPrice: item.costPrice,
            sa_name: item.sa_name
        }));

        user.barcodes = [...user.barcodes, ...updatedBarcodes];

        await user.save();

        res.status(200).json({ message: "Barcodes saved successfully", barcodes: user.barcodes });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};



export const getExistingBarcodes = async (req, res) => {
    try {
        const userId = req.user._id

        const user = await User.findById(userId).select('barcodes');

        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }

        res.json({ barcodes: user.barcodes })
    } catch (error) {
        console.error('Error fetching existing barcodes:', error);
        res.status(500).json({ message: "Server error", error });
    }
}


export const updateBarcodeCost = async (req, res) => {
    const { barcode } = req.params;
    const { costPrice } = req.body;

    if (!barcode || !costPrice) {
        return res.status(400).json({ message: "Barcode and costPrice are required" });
    }

    try {
        const user = await User.findById(req.user.id);

        const barcodeIndex = user.barcodes.findIndex(item => item.barcode === barcode);
        if (barcodeIndex === -1) {
            return res.status(404).json({ message: "Barcode not found" });
        }

        user.barcodes[barcodeIndex].costPrice = costPrice;
        await user.save();

        res.status(200).json({ message: "Cost price updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
