import express from "express";
import { getProfile, updateProfile } from "../controllers/profile";
import { checkAdmin } from "../middleware/checkAuth";

const router = express.Router();

// @route GET api/profile
// @desc Get profile info
// @access Public
router.get("/", getProfile);

// @route PATCH api/profile
// @desc Make changes to about item
// @access Private
router.patch("/", checkAdmin, updateProfile);

export default router;
