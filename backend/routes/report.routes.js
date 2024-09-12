import express from 'express';
import { getExistingBarcodes, getReportDetailByPeriod, saveBarcodes } from '../controllers/report.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.post('/report-detail', protectRoute, getReportDetailByPeriod);
router.post("/save-barcodes", protectRoute, saveBarcodes)
router.get("/get-existing-barcodes", protectRoute, getExistingBarcodes)
router.get("/get-existing-barcodes", protectRoute, getExistingBarcodes)

export default router;
