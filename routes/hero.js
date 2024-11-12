import express from "express";
import { addHeroItem, getAllHero } from "../controllers/hero.js";
import { checkAdmin } from "../middleware/checkAuth.js";

const router = express.Router();

// @route POST /hero
// @desc Add a new hero
// @access Private
router.post("/", checkAdmin, addHeroItem);

// @route GET /hero
// @desc Get all hero
// @access Public
router.get("/", getAllHero);

export default router;
