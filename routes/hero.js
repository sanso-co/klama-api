import express from "express";
import { addHeroItem, getAllHero } from "../controllers/hero.js";

const router = express.Router();

// @route POST /hero
// @desc Add a new hero
// @access Private
router.post("/", addHeroItem);

// @route GET /hero
// @desc Get all hero
// @access Private
router.get("/", getAllHero);

export default router;
