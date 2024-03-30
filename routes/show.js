import express from "express";
import { createShow, getAllShows } from "../controllers/show.js";

const router = express.Router();

// @route POST /shows
// @desc Create a new show
// @access Private
router.post("/", createShow);

// @route GET /shows
// @desc Get all shows
// @access Private
router.get("/", getAllShows);

export default router;
