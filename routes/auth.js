import express from "express";
// import { signup, login, googleAuth, completeProfile } from "../controllers/auth.js";
import { signup, login, googleAuth, completeProfile } from "../controllers/auth.js";
import { verifyToken } from "../middleware/checkAuth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleAuth);
router.post("/complete-profile", verifyToken, completeProfile);

export default router;
