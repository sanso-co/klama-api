import express from "express";
import { createTone, getAllTone, searchTone } from "../controllers/tone.js";
import { checkAdmin } from "../middleware/checkAuth.js";

const router = express.Router();

// @route POST /tone
// @desc Create a new tone
// @access Private
router.post("/", checkAdmin, createTone);

// @route GET /tone
// @desc Get all tone
// @access Private
router.get("/", getAllTone);

// @route GET /tone/search
// @desc Search tone
// @access Private
router.get("/search", searchTone);

export default router;
