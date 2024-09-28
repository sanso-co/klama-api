import express from "express";
import { updateShowCast, getCastsForShow, addCastToShow } from "../controllers/cast.js";

const router = express.Router();

// @route patch /cast/add/:showId
// @desc Add a new show to credit
// @access Private
router.patch("/add/:showId", addCastToShow);

// @route patch /cast/update/:showId
// @desc Add a new show to credit
// @access Private
router.patch("/update/:showId", updateShowCast);

// @route patch /cast/:showId
// @desc Add a new show to credit
// @access Private
router.get("/:showId", getCastsForShow);

export default router;
