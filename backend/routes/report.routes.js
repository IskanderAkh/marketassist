import express from 'express';
import { getExistingBarcodes, getReportDetailByPeriod, saveBarcodes, updateBarcodeCost } from '../controllers/report.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.post('/report-detail', protectRoute, getReportDetailByPeriod);
router.post("/save-barcodes", protectRoute, saveBarcodes)
router.get("/get-existing-barcodes", protectRoute, getExistingBarcodes)
router.put("/update-barcode-cost/:barcode", protectRoute, updateBarcodeCost)
export default router;
