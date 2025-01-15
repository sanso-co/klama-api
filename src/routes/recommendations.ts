import express from "express";
import { getSimilar } from "../controllers/recommendations";

const router = express.Router();

// @route GET /recommendations/similar/:id
// @desc Get similar recommendations
// @access Private
router.get("/similar/:showId", getSimilar);

export default router;
