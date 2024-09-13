import express from "express";
import { createKeyword, getAllKeywords, updateKeyword } from "../controllers/keyword.js";

const router = express.Router();

// @route POST /keyword
// @desc Create a new keyword
// @access Private
router.post("/", createKeyword);

// @route GET /keywords
// @desc Get all keywords
// @access Private
router.get("/", getAllKeywords);

// @route PATCH /keywords
// @desc Update a keyword
// @access Private
router.patch("/:id", updateKeyword);

export default router;
