import e from "express";
import { updateReviewsApiKey } from "../controllers/apiKey.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = e.Router()

router.put("/update-api-key", protectRoute, updateReviewsApiKey)

export default router