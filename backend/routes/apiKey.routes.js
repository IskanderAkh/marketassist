import e from "express";
import { updateApiKey } from "../controllers/apiKey.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = e.Router()

router.put("/update-api-key", protectRoute, updateApiKey)

export default router