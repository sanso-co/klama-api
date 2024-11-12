import express from "express";
import { updateShowCast, getCastsForShow, addCastToShow } from "../controllers/cast.js";
import { checkAdmin } from "../middleware/checkAuth.js";

const router = express.Router();

// @route patch /cast/add/:showId
// @desc Add a new show to credit
// @access Private
router.patch("/add/:showId", checkAdmin, addCastToShow);

// @route patch /cast/update/:showId
// @desc Add a new show to credit
// @access Private
router.patch("/update/:showId", checkAdmin, updateShowCast);

// @route patch /cast/:showId
// @desc Add a new show to credit
// @access Public
router.get("/:showId", getCastsForShow);

export default router;
