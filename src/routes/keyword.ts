import express from "express";
import { getAllKeyword, searchKeyword, createKeyword, updateKeyword } from "../controllers/keyword";
import { checkAdmin } from "../middleware/checkAuth";

const router = express.Router();

// @route GET api/keyword
// @desc Get all keywords
// @access Public
router.get("/", getAllKeyword);

// @route GET api/keyword/search
// @desc Search keyword
// @access Public
router.get("/search", searchKeyword);

// @route POST api/keyword
// @desc Create a new keyword
// @access Private
router.post("/", checkAdmin, createKeyword);

// @route PUT api/keyword/:id
// @desc Update keyword
// @access Private
router.put("/:id", checkAdmin, updateKeyword);

export default router;
