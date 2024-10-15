import e from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getAllPlans } from "../controllers/plans.controller.js";

const router = e.Router()

router.get('/getAllPlans', protectRoute, getAllPlans)

export default router