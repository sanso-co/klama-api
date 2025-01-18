import express from "express";
import { getAllGenre, searchGenre } from "../controllers/genre";

const router = express.Router();

// @route GET /genre
// @desc Get all genre
// @access Public
router.get("/", getAllGenre);

// @route GET /genre/search
// @desc Search genre
// @access Public
router.get("/search", searchGenre);

export default router;
