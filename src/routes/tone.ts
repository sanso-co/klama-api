import express from "express";
import { getAllTone } from "../controllers/tone";

const router = express.Router();

// @route GET /tone
// @desc Get all tone
// @access Public
router.get("/", getAllTone);

export default router;
