import express from "express";
import { addGenre, getAllGenre, searchGenre } from "../controllers/genre.js";
import { checkAdmin } from "../middleware/checkAuth.js";

const router = express.Router();

// @route POST /genre
// @desc Add a new genre
// @access Private
router.post("/", checkAdmin, addGenre);

// @route GET /genre
// @desc Get all genre
// @access Private
router.get("/", getAllGenre);

// @route GET /genre/search
// @desc Search drama
// @access Private
router.get("/search", searchGenre);

export default router;
