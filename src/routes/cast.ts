import express from "express";
import { getCastsForShow } from "../controllers/cast";

const router = express.Router();

// @route patch /cast/:showId
// @desc Add a new show to credit
// @access Public
router.get("/:showId", getCastsForShow);

export default router;
