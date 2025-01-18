import express from "express";
import { getAllHero, addHeroItem, updateHeroItem } from "../controllers/hero";
import { checkAdmin } from "../middleware/checkAuth";

const router = express.Router();

// @route GET /hero
// @desc Get all hero items
// @access Public
router.get("/", getAllHero);

// @route POST /hero
// @desc Add a new hero
// @access Private
router.post("/", checkAdmin, addHeroItem);

// @route PATCH /hero
// @desc Make changes to a hero item
// @access Private
router.patch("/:id", checkAdmin, updateHeroItem);

export default router;
