import express from "express";
import { submitUserEmotion } from "../controllers/recommend";

const router = express.Router();

// @route POST /recommend
// @desc Get recommendations based on feelings and questions submitted
// @access Public
router.post("/", submitUserEmotion);

export default router;
