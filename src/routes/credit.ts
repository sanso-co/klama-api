import express from "express";
import { getCreditForShow } from "../controllers/credit";

const router = express.Router();

// @route GET /credit/show/:id
// @desc Get Credits that belong to a show
// @access Public
router.get("/show/:showId", getCreditForShow);

export default router;
