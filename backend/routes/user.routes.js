import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { addOrUpdatePlanForUser, cancelSubscription, changeUserInformation, getUserBarcodes, getUserPlan, checkCalcPlanAccess, checkReviewPlanAccess } from '../controllers/user.controller.js';

const router = express.Router()

router.get('/barcodes', protectRoute, getUserBarcodes)
router.get('/plan', protectRoute, getUserPlan)
router.post('/updateUserInfo', protectRoute, changeUserInformation)
router.post('/purchase-plan', protectRoute, addOrUpdatePlanForUser)
router.post('/cancel-subscription', protectRoute, cancelSubscription)
router.post('/checkCalcPlanAccess', protectRoute, checkCalcPlanAccess);
router.post('/checkReviewPlanAccess', protectRoute, checkReviewPlanAccess);
export default router