import express from "express";
import { addGenre, getAllGenre, searchGenre, getGenreDetails } from "../controllers/genre.js";

const router = express.Router();

// @route POST /genre
// @desc Add a new genre
// @access Private
router.post("/", addGenre);

// @route GET /genre
// @desc Get all genre
// @access Private
router.get("/", getAllGenre);

// @route GET /genre/search
// @desc Search drama
// @access Private
router.get("/search", searchGenre);

// @route GET /genre/details/:id
// @desc Get show for a genre
// @access Private
router.get("/details/:genreId", getGenreDetails);

export default router;
