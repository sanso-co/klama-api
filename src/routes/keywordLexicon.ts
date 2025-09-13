import express from "express";
import {
    getAllKeywordLexicon,
    createKeywordLexicon,
    updateKeywordLexicon,
    getKeywordLexiconByTagId,
} from "../controllers/keywordLexicon";
import { checkAdmin } from "../middleware/checkAuth";

const router = express.Router();

// @route GET api/keyword-lexicon
// @desc Get all keyword lexicons
// @access Public
router.get("/", getAllKeywordLexicon);

// @route GET api/keyword-lexicon/:tag_id
// @desc Get keyword lexicon by tag_id
// @access Public
router.get("/:tag_id", getKeywordLexiconByTagId);

// @route POST api/keyword-lexicon
// @desc Create a new keyword lexicon
// @access Private
router.post("/", checkAdmin, createKeywordLexicon);

// @route PUT api/keyword-lexicon/:tag_id
// @desc Update keyword lexicon
// @access Private
router.put("/:tag_id", checkAdmin, updateKeywordLexicon);

export default router;
