import express from "express";
import { signup, login, googleAuth, completeProfile, refresh } from "../controllers/auth";
import { verifyToken } from "../middleware/checkAuth";

const router = express.Router();

// @route post /signup
// @desc Create a new user
// @access Public
router.post("/signup", signup);

// @route post /login
// @desc Login
// @access Public
router.post("/login", login);

// @route post /refresh
// @desc Refresh
// @access Private
router.post("/refresh", refresh);

// @route post /google
// @desc Google
// @access Public
router.post("/google", googleAuth);

// @route post /complete-profile
// @desc create username after google signup
// @access Private
router.post("/complete-profile", verifyToken, completeProfile);

export default router;
