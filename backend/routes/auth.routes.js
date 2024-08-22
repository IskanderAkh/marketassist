import e from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getUser, login, logout, signUp } from "../controllers/auth.controller.js";

const router = e.Router()
 
router.post("/signup", signUp)
router.post("/login", login)
router.post("/logout", logout)
router.get("/me", protectRoute, getUser)

export default router