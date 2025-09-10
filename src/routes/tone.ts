import express from "express";
import {
    getAllTone,
    searchTone,
    createTone,
    submitUserEmotion,
} from "../controllers/tone";
import { checkAdmin } from "../middleware/checkAuth";

const router = express.Router();

// @route GET api/tone
// @desc Get all tone
// @access Public
router.get("/", getAllTone);

// @route GET api/tone/search
// @desc Search tone
// @access Private
router.get("/search", searchTone);

// @route POST /tone
// @desc Create a new tone
// @access Private
router.post("/", checkAdmin, createTone);

// @route POST api/tone/recommend
// @desc Get all tone
// @access Public
router.post("/recommend", submitUserEmotion);

export default router;
