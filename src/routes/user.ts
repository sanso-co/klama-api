import express from "express";
import { getUserDetails } from "../controllers/user";
import { verifyToken, checkUserAccess } from "../middleware/checkAuth";

const router = express.Router();

// @route GET /user/details/:id
// @desc Get user details
// @access Public
router.get("/:id", verifyToken, checkUserAccess, getUserDetails);

export default router;
