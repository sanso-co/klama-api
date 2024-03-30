import express from "express";
import { checkToken } from "../middleware/checkAuth.js";
import { addToRated, getRated } from "../controllers/rate.js";

const router = express.Router();

// @route patch /rate/add
// @desc Add a show to rate collection
// @access Private
router.patch("/add", checkToken, addToRated);

// @route GET /like
// @desc View all liekd shows that belong to a user
// @access Private
router.get("/", checkToken, getRated);

export default router;
