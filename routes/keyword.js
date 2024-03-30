import express from "express";
import { createKeyword, getAllKeywords } from "../controllers/keyword.js";

const router = express.Router();

// @route POST /keyword
// @desc Create a new keyword
// @access Private
router.post("/", createKeyword);

// @route GET /keywords
// @desc Get all keywords
// @access Private
router.get("/", getAllKeywords);

export default router;
