import express from 'express';
import { getReportDetailByPeriod } from '../controllers/report.controller.js';

const router = express.Router();

router.post('/report-detail', getReportDetailByPeriod);

export default router;
