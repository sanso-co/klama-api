import express from "express";
import { getAllHero } from "../controllers/hero";

const router = express.Router();

// @route GET /hero
// @desc Get all hero items
// @access Public
router.get("/", getAllHero);

export default router;
