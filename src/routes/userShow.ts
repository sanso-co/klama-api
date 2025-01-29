import express from "express";
import {
    toggleWatch,
    toggleLike,
    getShowStatus,
    getShowsByCategory,
    toggleDislike,
    toggleBookmark,
    getUserShowCounts,
} from "../controllers/userShow";
import { verifyToken } from "../middleware/checkAuth";

const router = express.Router();

// @route GET /user-show/status/:showId
// @desc Get user-show status for each show
// @access Private
router.get("/status/:showId", verifyToken, getShowStatus);

// @route GET /user-show/category/:category
// @desc Get liked, disliked, watched or bookmarked show lists
// @access Private
router.get("/category/:category", verifyToken, getShowsByCategory);

// @route GET /user-show/counts
// @desc Get counts for liked, disliked, watched or bookmarked shows
// @access Private
router.get("/counts", verifyToken, getUserShowCounts);

// @route POST /user-show/watched/:showId
// @desc Mark show watched
// @access Private
router.post("/watched/:showId", verifyToken, toggleWatch);

// @route POST /user-show/liked/:showId
// @desc Mark show liked
// @access Private
router.post("/liked/:showId", verifyToken, toggleLike);

// @route POST /user-show/disliked/:showId
// @desc Mark show disliked
// @access Private
router.post("/disliked/:showId", verifyToken, toggleDislike);

// @route POST /user-show/bookmarked/:showId
// @desc Mark show bookmarked
// @access Private
router.post("/bookmarked/:showId", verifyToken, toggleBookmark);

export default router;
