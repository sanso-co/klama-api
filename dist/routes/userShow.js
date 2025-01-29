"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userShow_1 = require("../controllers/userShow");
const checkAuth_1 = require("../middleware/checkAuth");
const router = express_1.default.Router();
// @route GET /user-show/status/:showId
// @desc Get user-show status for each show
// @access Private
router.get("/status/:showId", checkAuth_1.verifyToken, userShow_1.getShowStatus);
// @route GET /user-show/category/:category
// @desc Get liked, disliked, watched or bookmarked show lists
// @access Private
router.get("/category/:category", checkAuth_1.verifyToken, userShow_1.getShowsByCategory);
// @route GET /user-show/counts
// @desc Get counts for liked, disliked, watched or bookmarked shows
// @access Private
router.get("/counts", checkAuth_1.verifyToken, userShow_1.getUserShowCounts);
// @route POST /user-show/watched/:showId
// @desc Mark show watched
// @access Private
router.post("/watched/:showId", checkAuth_1.verifyToken, userShow_1.toggleWatch);
// @route POST /user-show/liked/:showId
// @desc Mark show liked
// @access Private
router.post("/liked/:showId", checkAuth_1.verifyToken, userShow_1.toggleLike);
// @route POST /user-show/disliked/:showId
// @desc Mark show disliked
// @access Private
router.post("/disliked/:showId", checkAuth_1.verifyToken, userShow_1.toggleDislike);
// @route POST /user-show/bookmarked/:showId
// @desc Mark show bookmarked
// @access Private
router.post("/bookmarked/:showId", checkAuth_1.verifyToken, userShow_1.toggleBookmark);
exports.default = router;
