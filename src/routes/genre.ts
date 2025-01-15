import express from "express";
import { getAllGenre } from "../controllers/genre";

const router = express.Router();

// @route GET /genre
// @desc Get all shows
// @access Public
router.get("/", getAllGenre);

export default router;
