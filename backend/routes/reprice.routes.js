import express from "express";
import { protectRoute } from '../middleware/protectRoute.js';

import { getProducts, getWarehouseRemains, setProductReprice, deleteProductReprice, updateProductReprice, getExistingBarcodes } from "../controllers/reprice.controller.js";

const router = express.Router();

// Route to get products
router.get('/get-products', protectRoute, getProducts);

router.get('/get-warehouse-remains', protectRoute, getWarehouseRemains);

router.get('/get-existing-barcodes', protectRoute, getExistingBarcodes);

router.post('/set-product-reprice', protectRoute, setProductReprice);

router.post('/update-product-reprice', protectRoute, updateProductReprice);

router.delete('/delete-product-reprice/:barcode', protectRoute, deleteProductReprice);



export default router;
