import express from "express";
import {
    markWatched,
    toggleLike,
    getShowStatus,
    getShowsByCategory,
    toggleDislike,
    toggleWishlist,
} from "../controllers/userShow";
import { verifyToken } from "../middleware/checkAuth";

const router = express.Router();

// @route GET /user-show/status/:showId
// @desc Get show status
// @access Private
router.get("/status/:showId", verifyToken, getShowStatus);

// @route GET /user-show/category/:category
// @desc Get show status
// @access Private
router.get("/category/:category", verifyToken, getShowsByCategory);

// @route POST /user-show/watched/:showId
// @desc Mark show watched
// @access Private
router.post("/watched/:showId", verifyToken, markWatched);

// @route POST /user-show/liked/:showId
// @desc Mark show liked
// @access Private
router.post("/liked/:showId", verifyToken, toggleLike);

// @route POST /user-show/disliked/:showId
// @desc Mark show dislied
// @access Private
router.post("/disliked/:showId", verifyToken, toggleDislike);

// @route POST /user-show/disliked/:showId
// @desc Mark show dislied
// @access Private
router.post("/wishlisted/:showId", verifyToken, toggleWishlist);

export default router;
