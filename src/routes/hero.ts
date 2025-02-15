import express from "express";
import { getAllHero, addHeroItem, updateHeroItem, removeHeroItem } from "../controllers/hero";
import { checkAdmin } from "../middleware/checkAuth";

const router = express.Router();

// @route GET api/hero
// @desc Get all hero items
// @access Public
router.get("/", getAllHero);

// @route POST api/hero
// @desc Add a new hero
// @access Private
router.post("/", checkAdmin, addHeroItem);

// @route PATCH api/hero
// @desc Make changes to a hero item
// @access Private
router.patch("/:id", checkAdmin, updateHeroItem);

// @route DETELE api/hero
// @desc Remove a hero item
// @access Private
router.delete("/:id", checkAdmin, removeHeroItem);

export default router;
