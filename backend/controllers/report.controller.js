// report.controller.js
import axios from 'axios';
import User from '../models/user.model.js';

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

    if (!barcodes || barcodes.length === 0) {
        return res.status(400).json({ message: "Barcodes are required" });
    }

    try {
        const user = await User.findById(req.user.id); // Assuming user ID is available in req.user

        if (user.barcodes.length + barcodes.length > user.allowedNumberOfBarcodes) {
            return res.status(403).json({ message: "You have exceeded your allowed number of barcodes" });
        }

        // Add new barcodes
        user.barcodes = [...user.barcodes, ...barcodes];

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