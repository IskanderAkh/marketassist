import e from "express";
import { getAllPlans } from "../controllers/plans.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = e.Router()

router.get('/getAllPlans', protectRoute, getAllPlans)

export default router