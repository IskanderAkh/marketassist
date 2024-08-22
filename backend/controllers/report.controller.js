// report.controller.js
import axios from 'axios';

const processData = (data) => {
    const grouped = data.reduce((acc, item) => {
        const barcode = item.barcode;
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

        if (item.supplier_oper_name === "Логистика") {
            item.delivery_rub > 0
                ? (acc[barcode].logisticsCost += Number(item.delivery_rub))
                : (acc[barcode].logisticsCost += Number(item.delivery_rub * -1));
        } else if (item.supplier_oper_name === "Продажа") {
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

    return Object.values(grouped);
};

// Controller function to handle the report detail request
export const getReportDetailByPeriod = async (req, res) => {
    try {
        const { apiKey, dateFrom, dateTo } = req.body;

        const response = await axios.get('https://statistics-api.wildberries.ru/api/v5/supplier/reportDetailByPeriod', {
            headers: {
                'Authorization': apiKey,
                'Content-Type': 'application/json'
            },
            params: {
                dateFrom,
                dateTo,
                rrdid: ''
            }
        });

        const data = response.data;        
        res.json(data);
    } catch (error) {
        console.error('Error in getReportDetailByPeriod:', error);
        res.status(500).json({ error: 'Error fetching report details' });
    }
};
