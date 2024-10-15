import e from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { applyFilters, getAcceptanceRate, getListOfWarehouses, toggleAutoSearch, toggleFilters } from "../controllers/warehouse.controller.js";

const router = e.Router()

router.post('/getListOfWarehouses', protectRoute, getListOfWarehouses);
router.post('/getAcceptanceRate', protectRoute, getAcceptanceRate);
router.post('/toggleAutoSearch', protectRoute, toggleAutoSearch);
router.post("/toggleFilters", protectRoute, toggleFilters);
router.post("/applyFilters", protectRoute, applyFilters);



export default router