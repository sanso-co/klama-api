import express from "express";
import { addHeroItem, getAllHero, removeHeroItem, updateHeroItem } from "../controllers/hero.js";
import { checkAdmin } from "../middleware/checkAuth.js";

const router = express.Router();

// @route POST /hero
// @desc Add a new hero
// @access Private
router.post("/", checkAdmin, addHeroItem);

// @route DETELE /hero
// @desc Remove a hero item
// @access Private
router.delete("/:id", checkAdmin, removeHeroItem);

// @route PATCH /hero
// @desc Make changes to a hero item
// @access Private
router.patch("/:id", checkAdmin, updateHeroItem);

// @route GET /hero
// @desc Get all hero items
// @access Public
router.get("/", getAllHero);

export default router;
