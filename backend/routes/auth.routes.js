import e from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { cancelRegistration, getUser, login, logout, requestNewVerificationCode, resetPassword, resetPasswordToken, signUp, verifyEmail } from "../controllers/auth.controller.js";

const router = e.Router()

router.post("/signup", signUp)
router.post("/login", login)
router.post("/logout", logout)
router.get("/me", protectRoute, getUser)
router.post("/verify-email", verifyEmail);
router.post("/request-new-verification-code", protectRoute, requestNewVerificationCode);
router.post("/cancel-registration", protectRoute, cancelRegistration)
router.post("/forgot-password", resetPassword); 
router.post("/password-reset/:token", resetPasswordToken); 

export default router