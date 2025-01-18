import express from "express";
import { getAllKeyword, searchKeyword } from "../controllers/keyword";

const router = express.Router();

// @route GET /keyword
// @desc Get all keywords
// @access Public
router.get("/", getAllKeyword);

// @route GET /keyword/search
// @desc Search keyword
// @access Public
router.get("/search", searchKeyword);

export default router;
