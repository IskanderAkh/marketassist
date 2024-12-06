import axios from "axios";
import User from "../models/user.model.js";
import cron from 'node-cron';
import { cache } from '../server.js';

export const getProducts = async (req, res) => {
  const { dateFrom } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    const apiKey = user.apiKeys.repriceApiKey;

    const cachedProducts = cache.get(`products:${userId}`);
    if (cachedProducts) {
      return res.status(200).json({ products: cachedProducts });
    }

    const response = await axios.get(
      'https://statistics-api.wildberries.ru/api/v1/supplier/stocks',
      {
        headers: { Authorization: apiKey },
        params: { dateFrom: dateFrom ? dateFrom : '2024-01-01' },
      }
    );

    const warehousesResponse = await axios.get(
      'https://marketplace-api.wildberries.ru/api/v3/warehouses',
      { headers: { Authorization: apiKey } }
    );

    const skus = user.repricingData.map((product) => product.barcode);
    if (skus.length === 0) {
      return res.status(400).json({ error: "Нет доступных barcodes для Репрайсера" });
    }

    const sellerWarehouses = warehousesResponse.data;

    const productsData = [];
    for (const warehouse of sellerWarehouses) {
      const warehouseId = warehouse.id;

      const productResponse = await axios.post(
        `https://marketplace-api.wildberries.ru/api/v3/stocks/${warehouseId}`,
        { skus },
        { headers: { Authorization: apiKey } }
      );

      if (productResponse.data && productResponse.data.stocks) {
        productsData.push(...productResponse.data.stocks);
      }
    }

    const mergedDataMap = new Map();

    response.data.forEach((item) => {
      const barcode = item.barcode;
      if (!mergedDataMap.has(barcode)) {
        mergedDataMap.set(barcode, {
          barcode,
          quantity: 0,
          inWayToClient: 0,
          inWayFromClient: 0,
          quantityFull: 0,
          supplierArticle: item.supplierArticle || '',
          brand: item.brand || '',
          subject: item.subject || '',
          Price: item.Price || 0,
          Discount: item.Discount || 0,
        });
      }
      const existing = mergedDataMap.get(barcode);
      mergedDataMap.set(barcode, {
        ...existing,
        quantity: existing.quantity + item.quantity,
        inWayToClient: existing.inWayToClient + item.inWayToClient,
        inWayFromClient: existing.inWayFromClient + item.inWayFromClient,
        quantityFull: existing.quantityFull + item.quantityFull,
      });
    });

    productsData.forEach((item) => {
      const barcode = item.sku || item.barcode;
      if (!mergedDataMap.has(barcode)) {
        mergedDataMap.set(barcode, {
          barcode,
          quantity: 0,
          inWayToClient: 0,
          inWayFromClient: 0,
          quantityFull: 0,
          supplierArticle: '',
          brand: '',
          subject: '',
          Price: 0,
          Discount: 0,
        });
      }
      const existing = mergedDataMap.get(barcode);
      mergedDataMap.set(barcode, {
        ...existing,
        quantity: existing.quantity + (item.amount || 0),
      });
    });

    const finalProducts = Array.from(mergedDataMap.values());

    cache.set(`products:${userId}`, finalProducts);

    return res.json({ products: finalProducts });
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

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

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

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    const updatedRepricingData = user.repricingData.filter(product => product.barcode !== barcode);

    if (updatedRepricingData.length === user.repricingData.length) {
      return res.status(404).json({ error: 'Product not found.' });
    }
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

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const product = user.repricingData.find(item => item.barcode === barcode);

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    if (changeRatio !== undefined) {
      product.changeRatio = changeRatio;
    }
    if (threshold !== undefined) {
      product.threshold = threshold;
    }

    await user.save();

    res.status(200).json({ message: 'Product repricing data updated successfully.' });
  } catch (error) {
    console.error('Error in updateProductReprice:', error);
    res.status(500).json({ error: 'Failed to update product repricing data.' });
  }
};




export const checkAndUpdateProductPrices = async (userId) => {
  try {
    const user = await getUserData(userId);
    if (!user) return;

    const { repricingData, apiKeys } = user;
    if (!repricingData || repricingData.length === 0) return;

    const stockResponse = await fetchStockData(apiKeys);
    const warehousesResponse = await fetchWarehousesData(apiKeys);
    const skus = repricingData.map((product) => product.barcode);
    if (skus.length === 0) return;

    const productsData = await fetchProductsData(warehousesResponse, skus, apiKeys);

    const mergedStockData = mergeStockAndProductsData(stockResponse, productsData, skus);

    const productsToUpdate = calculateProductsToUpdate(repricingData, mergedStockData);
    if (productsToUpdate.length === 0) return;

    await logAndSaveProducts(productsToUpdate);
    await updatePrices(apiKeys, productsToUpdate);
    console.log('User: ', user,'ProductsToUpdate: ' ,productsToUpdate);
    await removeUpdatedProducts(user, productsToUpdate);
    
  } catch (error) {
    handleError(userId, error);
  }
};

const getUserData = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    console.error(`User not found for userId: ${userId}`);
    return null;
  }
  return user;
};

const fetchStockData = async (apiKeys) => {
  return await axios.get(
    'https://statistics-api.wildberries.ru/api/v1/supplier/stocks',
    {
      headers: { Authorization: apiKeys.repriceApiKey },
      params: { dateFrom: '2024-01-01' },
    }
  );
};

const fetchWarehousesData = async (apiKeys) => {
  return await axios.get(
    'https://marketplace-api.wildberries.ru/api/v3/warehouses',
    { headers: { Authorization: apiKeys.repriceApiKey } }
  );
};

const fetchProductsData = async (warehousesResponse, skus, apiKeys) => {
  const sellerWarehouses = warehousesResponse.data;
  const productsData = [];

  for (const warehouse of sellerWarehouses) {
    const warehouseId = warehouse.id;

    const productResponse = await axios.post(
      `https://marketplace-api.wildberries.ru/api/v3/stocks/${warehouseId}`,
      { skus },
      { headers: { Authorization: apiKeys.repriceApiKey } }
    );

    if (productResponse.data && productResponse.data.stocks) {
      productsData.push(...productResponse.data.stocks);
    }
  }
  return productsData;
};

const mergeStockAndProductsData = (stockResponse, productsData, skus) => {
  const mergedDataMap = new Map();

  stockResponse.data.forEach((item) => {
    if (skus.includes(item.barcode)) {
      if (!mergedDataMap.has(item.barcode)) {
        mergedDataMap.set(item.barcode, initializeProductData(item));
      }
      updateMergedDataMap(mergedDataMap, item);
    }
  });

  productsData.forEach((item) => {
    if (skus.includes(item.sku || item.barcode)) {
      if (!mergedDataMap.has(item.sku)) {
        mergedDataMap.set(item.sku || item.barcode, initializeEmptyProductData(item));
      }
      updateMergedProductData(mergedDataMap, item);
    }
  });

  return Array.from(mergedDataMap.values());
};

const initializeProductData = (item) => {
  return {
    nmId: item.nmId,
    barcode: item.barcode,
    quantity: item.quantity,
    inWayToClient: item.inWayToClient,
    inWayFromClient: item.inWayFromClient,
    quantityFull: item.quantityFull,
    supplierArticle: item.supplierArticle || '',
    brand: item.brand || '',
    subject: item.subject || '',
    Price: item.Price || 0,
    Discount: item.Discount || 0,
  };
};

const initializeEmptyProductData = (item) => {
  return {
    barcode: item.sku || item.barcode,
    nmId: 0,
    quantity: 0,
    inWayToClient: 0,
    inWayFromClient: 0,
    quantityFull: 0,
    supplierArticle: '',
    brand: '',
    subject: '',
    Price: 0,
    Discount: 0,
  };
};

const updateMergedDataMap = (mergedDataMap, item) => {
  const existing = mergedDataMap.get(item.barcode);
  mergedDataMap.set(item.barcode, {
    ...existing,
    quantity: existing.quantity + item.quantity,
    inWayToClient: existing.inWayToClient + item.inWayToClient,
    inWayFromClient: existing.inWayFromClient + item.inWayFromClient,
    quantityFull: existing.quantityFull + item.quantityFull,
  });
};

const updateMergedProductData = (mergedDataMap, item) => {
  const existing = mergedDataMap.get(item.sku || item.barcode);
  mergedDataMap.set(item.sku || item.barcode, {
    ...existing,
    quantity: existing.quantity + (item.amount || 0),
  });
};

const calculateProductsToUpdate = (repricingData, mergedStockData) => {
  const productsToUpdate = [];
  for (const product of repricingData) {
    const stockProduct = mergedStockData.find((item) => item.barcode === product.barcode);

    if (stockProduct && stockProduct.quantity <= product.threshold) {
      const newPrice = stockProduct.Price * (1 + (product.changeRatio / 100));
      productsToUpdate.push({
        nmId: stockProduct.nmId,
        price: Math.round(newPrice),
        discount: stockProduct.Discount || 0,
      });
    }
  }
  return productsToUpdate;
};

const logAndSaveProducts = async (productsToUpdate) => {
  console.log(productsToUpdate);
};

const updatePrices = async (apiKeys, productsToUpdate) => {
  const response = await axios.post(
    'https://discounts-prices-api.wildberries.ru/api/v2/upload/task',
    { data: productsToUpdate },
    {
      headers: {
        Authorization: apiKeys.repriceApiKey,
        'Content-Type': 'application/json',
      },
    }
  );
  console.log('Prices updated successfully', response.data);
};

const removeUpdatedProducts = async (user, productsToUpdate) => {
  user.repricingData = user.repricingData.filter(
    (product) => !productsToUpdate.some((updatedProduct) => updatedProduct.nmId === product.barcode)
  );
  await user.save();
};

const handleError = (userId, error) => {
  if (error.response) {
    console.error(`Error updating product prices for user ${userId}:`, error.response.data);
  } else {
    console.error('Error updating product prices:', error);
  }
};
cron.schedule('*/2 * * * *', async () => {
  console.log('Running cron job to check and update product prices...');

  try {
    const users = await User.find({ repricingData: { $exists: true, $ne: [] } });

    for (const user of users) {
      await checkAndUpdateProductPrices(user._id);
    }
  } catch (error) {
    console.error('Error running cron job:', error);
  }
});
