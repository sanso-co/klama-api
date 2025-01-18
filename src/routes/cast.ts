import express from "express";
import { getCastsForShow, updateShowCast } from "../controllers/cast";
import { checkAdmin } from "../middleware/checkAuth";

const router = express.Router();

// @route patch /cast/:showId
// @desc Add a new show to credit
// @access Public
router.get("/:showId", getCastsForShow);

// @route patch /cast/update/:showId
// @desc Add a new show to credit
// @access Private
router.patch("/update/:showId", checkAdmin, updateShowCast);

export default router;
