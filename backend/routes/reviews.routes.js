import e from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getReviews, setAnswersonReviews, toggleAutoResponses, updateResponses } from "../controllers/reviews.controller.js";
const router = e.Router()

router.get('/get-reviews', protectRoute, getReviews)
router.patch('/respond-to-all-reviews', protectRoute, setAnswersonReviews)
router.post('/toggle-auto-responses', protectRoute, toggleAutoResponses)

router.post('/save-responses', protectRoute, updateResponses);

export default router