import axios from 'axios';
import User from '../models/user.model.js';
import cron from 'node-cron';
import { sendSuccessWHEmail } from '../mail/emails.js';

let autoSearchSettings = {};


export const getListOfWarehouses = async (req, res) => {
    try {

        const { apiKey } = req.body;

        const axiosResponse = await axios.get('https://supplies-api.wildberries.ru/api/v1/warehouses', {
            headers: {
                Authorization: apiKey,
            }
        });

        return res.json(axiosResponse.data);
    } catch (error) {
        console.error('Ошибка загрузки складов:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


export const getAcceptanceRate = async (req, res) => {
    try {
        const { apiKey, warehouseId } = req.body;

        const params = warehouseId ? { warehouseIDs: `${warehouseId}` } : {}
        const axiosResponse = await axios.get('https://supplies-api.wildberries.ru/api/v1/acceptance/coefficients',
            {
                headers: {
                    Authorization: apiKey,
                },
                params: params
            }
        )
        const response = axiosResponse.data
        return res.json(response);

    } catch (error) {
        console.error('Ошибка загрузки Коэффицентов:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
const fetchWarehouses = async (whApiKey, warehouseIds = null) => {
    try {
        const params = warehouseIds ? { warehouseIDs: warehouseIds.join(',') } : {};
        const axiosResponse = await axios.get(
            "https://supplies-api.wildberries.ru/api/v1/acceptance/coefficients",
            {
                headers: {
                    Authorization: whApiKey,
                },
                params: params,
            }
        );
        return axiosResponse.data;
    } catch (error) {
        console.error("Failed to fetch warehouse data:", error);
        return [];
    }
};



export const toggleAutoSearch = (req, res) => {
    const { apiKey, warehouseId, startDate, endDate, minRate, maxRate, isEnabled } = req.body;

    if (isEnabled) {
        autoSearchSettings[apiKey] = { warehouseId, startDate, endDate, minRate, maxRate };
    } else {
        delete autoSearchSettings[apiKey];
    }

    res.json({ message: isEnabled ? 'Автопоиск включен' : 'Автопоиск выключен' });
};

const runAutoSearchForUsers = async () => {
    try {
        const users = await User.find({ whsearchEnabled: true });

        for (const user of users) {
            const { whApiKey, filters } = user;

            const warehouses = await fetchWarehouses(whApiKey, filters.warehouseIds);

            const filteredWarehouses = warehouses.filter(warehouse => {
                const validDate = new Date(warehouse.date) >= new Date(filters.dateRange[0]) &&
                    new Date(warehouse.date) <= new Date(filters.dateRange[1]);
                const validRate = warehouse.coefficient >= filters.sliderValues[0] &&
                    warehouse.coefficient <= filters.sliderValues[1];
                return validDate && validRate;
            });

            filteredWarehouses.sort((a, b) => {
                if (a.coefficient === b.coefficient) {
                    return new Date(a.date) - new Date(b.date);
                }
                return a.coefficient - b.coefficient;
            });

            if (filteredWarehouses.length) {
                console.log(`User ${user._id}: Found matching warehouses.`);
                console.log(filteredWarehouses);

                sendSuccessWHEmail(user.email, filteredWarehouses[0].warehouseName, filteredWarehouses[0].boxTypeName, filteredWarehouses[0].date, filteredWarehouses[0].coefficient);

                user.whsearchEnabled = false;
                user.filters = {};
                await user.save();
            } else {
                console.log(`User ${user._id}: No matching warehouses found.`);
            }
        }
    } catch (error) {
        console.error('Error running auto search cron:', error);
    }
};


export const toggleFilters = async (req, res) => {
    const { userId, whsearchEnabled } = req.body;

    try {
        const user = await User.findById(userId);

        if (whsearchEnabled && (!user.filters || Object.keys(user.filters).length === 0)) {
            return res.status(400).send({ message: 'Cannot enable autoSearch without filters.' });
        }

        await User.findByIdAndUpdate(userId, {
            whsearchEnabled,
        });

        const message = whsearchEnabled ? 'AutoSearch enabled successfully' : 'AutoSearch disabled successfully';
        res.status(200).send({ message });
    } catch (error) {
        console.error('Error toggling filters:', error);
        res.status(500).send({ message: 'Failed to toggle filters' });
    }
}
export const applyFilters = async (req, res) => {
    const { userId, filters } = req.body;
    console.log(filters);

    try {
        await User.findByIdAndUpdate(userId, {
            $set: { filters: filters },
        });

        res.status(200).send({ message: 'Filters saved successfully' });
    } catch (error) {
        console.error('Error saving filters:', error);
        res.status(500).send({ message: 'Failed to save filters' });
    }
}
cron.schedule('*/5 * * * *', runAutoSearchForUsers);


