// report.controller.js
import axios from 'axios';

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
