import axios from 'axios';
import User from '../models/user.model.js';

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
            }
        });
        const data = response.data;
        res.json(data);
    } catch (error) {
        console.error('Error in getReportDetailByPeriod:', error);
        res.status(500).json({ error: 'Error fetching report details' });
    }
};

export const saveBarcodes = async (req, res) => {
    const { barcodes } = req.body;

    console.log('Received barcodes:', barcodes); 

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