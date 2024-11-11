import axios from "axios";
import fs from "fs"
import User from "../models/user.model.js";

export const getProducts = async (req, res) => {
    const { dateFrom } = req.body;
    const userId = req.user._id;
    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ error: "Пользователь не найден" })
        }

        const apiKey = user.apiKeys.repriceApiKey;

        const response = await axios.get(
            'https://statistics-api.wildberries.ru/api/v1/supplier/stocks',
            {
                headers: { Authorization: apiKey },
                params: { dateFrom: dateFrom ? dateFrom : '2024-01-01' }
            }
        );

        const data = await axios.get('https://marketplace-api.wildberries.ru/api/v3/warehouses',
            {
                headers: {
                    Authorization: apiKey
                }
            }
        )
        const sellerWarehouses = data.data
        fs.writeFileSync('sellerWarehouses.json', JSON.stringify(sellerWarehouses))
        
        return res.json({ response: response.data });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send({ message: 'Failed to fetch products' });
    }
};

const createWarehouseRemains = async (apiKey) => {
    try {
        const { data } = await axios.get(
            'https://seller-analytics-api.wildberries.ru/api/v1/warehouse_remains',
            {
                headers: { Authorization: apiKey }
            }
        );

        const taskId = data?.data?.taskId;

        fs.appendFileSync('taskIds.txt', `${taskId}\n`);

        if (!taskId) {
            throw new Error('taskId is missing from the response.');
        }

        return taskId;
    } catch (error) {
        console.error('Failed to create warehouse remains report:', error);
        throw error;
    }
};

export const getWarehouseRemains = async (req, res) => {
    try {
        const { apiKey } = req.body;
        const taskId = await createWarehouseRemains(apiKey);

        setTimeout(async () => {
            try {
                const { data } = await axios.get(
                    `https://seller-analytics-api.wildberries.ru/api/v1/warehouse_remains/tasks/${taskId}/download`,
                    {
                        headers: { Authorization: apiKey }
                    }
                );
                return res.json({ data });
            } catch (error) {
                console.error('Error downloading warehouse remains:', error);
                res.status(500).json({ error: 'Failed to download warehouse remains.' });
            }
        }, 5000);
    } catch (error) {
        console.error('Error fetching warehouse remains:', error);
        res.status(500).json({ error: 'Failed to fetch warehouse remains.' });
    }
};

export const getExistingBarcodes = async (req, res) => {
    try {
        const userId = req.user._id;

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Map to get an array of all barcodes in repricingData
        const barcodes = user.repricingData.map(product => product.barcode);

        res.status(200).json({ barcodes });
    } catch (error) {
        console.error('Error in getExistingBarcodes:', error);
        res.status(500).json({ error: 'Failed to retrieve existing barcodes.' });
    }
};

export const setProductReprice = async (req, res) => {
    try {
        const userId = req.user._id;
        const { barcode, threshold, changeRatio } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found.' });

        const productExists = user.repricingData.some(product => product.barcode === barcode);
        if (productExists) return res.status(400).json({ error: 'Product already exists.' });

        user.repricingData.push({ barcode, threshold, changeRatio });
        await user.save();

        res.status(200).json({ message: 'Product added to repricing list.' });
    } catch (error) {
        console.error('Error in setProductReprice:', error);
        res.status(500).json({ error: 'Failed to set product for repricing.' });
    }
};


export const deleteProductReprice = async (req, res) => {
    try {
        const userId = req.user._id;
        const { barcode } = req.params;


        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Filter out the product with the specified barcode
        const updatedRepricingData = user.repricingData.filter(product => product.barcode !== barcode);

        // Check if the product existed in the array
        if (updatedRepricingData.length === user.repricingData.length) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        // Update the repricingData array and save
        user.repricingData = updatedRepricingData;
        await user.save();

        res.status(200).json({ message: 'Product removed successfully.' });
    } catch (error) {
        console.error('Error in deleteProductReprice:', error);
        res.status(500).json({ error: 'Failed to delete product for repricing.' });
    }
};

export const updateProductReprice = async (req, res) => {
    try {
        const userId = req.user._id;
        const { barcode, changeRatio, threshold } = req.body;

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Find the product with the specified barcode
        const product = user.repricingData.find(item => item.barcode === barcode);

        if (!product) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        // Update only if new values are provided
        if (changeRatio !== undefined) {
            product.changeRatio = changeRatio;
        }
        if (threshold !== undefined) {
            product.threshold = threshold;
        }

        // Save the updated user document
        await user.save();

        res.status(200).json({ message: 'Product repricing data updated successfully.' });
    } catch (error) {
        console.error('Error in updateProductReprice:', error);
        res.status(500).json({ error: 'Failed to update product repricing data.' });
    }
};
