import express from "express";
import { addShowType, getAllShowType } from "../controllers/showType.js";
import { checkAdmin } from "../middleware/checkAuth.js";

const router = express.Router();

// @route POST /drama
// @desc Add a new drama to the list
// @access Private
router.post("/", checkAdmin, addShowType);

// @route GET /drama
// @desc Get all drama
// @access Private
router.get("/", getAllShowType);

export default router;
