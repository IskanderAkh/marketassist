import express from 'express';
import { protectRoute } from "../middleware/protectRoute.js";
import { chatWithGPT } from '../controllers/chat.controller.js';

const router = express.Router();

router.post('/chat', protectRoute, chatWithGPT);

export default router;
