import e from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getReviews, setAnswersonReviews } from "../controllers/reviews.controller.js";
const router = e.Router()

router.get('/get-reviews', protectRoute, getReviews)
router.patch('/respond-to-all-reviews', protectRoute, setAnswersonReviews)

export default router