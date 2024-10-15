import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { addOrUpdatePlanForUser, cancelSubscription, changeUserInformation, getUserBarcodes, getUserPlan, checkCalcPlanAccess, checkReviewPlanAccess, updateMarketDetails, updateErrorVisibility, updateCalcApiKey, updateWHApiKey } from '../controllers/user.controller.js';


const router = express.Router()

router.get('/barcodes', protectRoute, getUserBarcodes)
router.get('/plan', protectRoute, getUserPlan)
router.post('/updateUserInfo', protectRoute, changeUserInformation)
router.post('/purchase-plan', protectRoute, addOrUpdatePlanForUser)
router.post('/cancel-subscription', protectRoute, cancelSubscription)
router.post('/checkCalcPlanAccess', protectRoute, checkCalcPlanAccess);
router.post('/checkReviewPlanAccess', protectRoute, checkReviewPlanAccess);
router.put('/update-market-details', protectRoute, updateMarketDetails)
router.put('/:userId/errors/:errorId', protectRoute, updateErrorVisibility);
router.put('/update-calc-api-key', protectRoute, updateCalcApiKey)
router.put('/update-wh-api-key', protectRoute, updateWHApiKey)

export default router