import express from "express";
import {
    createKeyword,
    getAllKeywords,
    getKeywordsForShow,
    updateKeyword,
    searchKeyword,
    addShowToKeyword,
    getKeywordDetails,
} from "../controllers/keyword.js";

const router = express.Router();

// @route POST /keyword
// @desc Create a new keyword
// @access Private
router.post("/", createKeyword);

// @route GET /keywords
// @desc Get all keywords
// @access Private
router.get("/", getAllKeywords);

// @route GET /keywords/show/:id
// @desc Get keywords that belong to a show
// @access Private
router.get("/show/:showId", getKeywordsForShow);

// @route GET /keywords/show/:id
// @desc Get keywords that belong to a show
// @access Private
router.get("/detail/:keywordId", getKeywordDetails);

// @route GET /keywords/search
// @desc Search keyword
// @access Private
router.get("/search", searchKeyword);

// @route PATCH /keywords/modify/:id
// @desc Update a keyword
// @access Private
router.patch("/modify/:id", updateKeyword);

// @route patch /keywords/add/:id
// @desc Add a new show to keyword
// @access Private
router.patch("/add/:id", addShowToKeyword);

export default router;
