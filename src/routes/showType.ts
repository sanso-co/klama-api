import express from "express";
import { getAllShowType } from "../controllers/showType";

const router = express.Router();

// @route GET /
// @desc Get all show types
// @access Public
router.get("/", getAllShowType);

export default router;
