import express from "express";
import {
    createKeyword,
    getAllKeywords,
    getKeywordsForShow,
    updateKeyword,
    searchKeyword,
} from "../controllers/keyword.js";
import { checkAdmin } from "../middleware/checkAuth.js";

const router = express.Router();

// @route POST /keyword
// @desc Create a new keyword
// @access Private
router.post("/", checkAdmin, createKeyword);

// @route GET /keywords
// @desc Get all keywords
// @access Public
router.get("/", getAllKeywords);

// @route GET /keywords/show/:id
// @desc Get keywords that belong to a show
// @access Public
router.get("/show/:showId", getKeywordsForShow);

// @route PATCH /keywords/modify/:id
// @desc Update a keyword
// @access Private
router.patch("/modify/:id", checkAdmin, updateKeyword);

// @route GET /keywords/search
// @desc Search keyword
// @access Public
router.get("/search", searchKeyword);

export default router;
