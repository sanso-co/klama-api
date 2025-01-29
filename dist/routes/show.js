"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const show_1 = require("../controllers/show");
const checkAuth_1 = require("../middleware/checkAuth");
const router = express_1.default.Router();
// @route GET /show
// @desc Get all shows
// @access Public
router.get("/", show_1.getAllShow);
// @route GET /show/details/:id
// @desc Get show details
// @access Public
router.get("/details/:id", show_1.getShowDetails);
// @route GET /show/list/:category/:id
// @desc Get show collection by categories
// @access Public
router.get("/list/:category/:id", show_1.getShowCategoryList);
// @route GET /show/search
// @desc Search show
// @access Public
router.get("/search", show_1.searchShow);
// @route POST /show
// @desc Add a new show to the list from TMDB
// @access Private
router.post("/", checkAuth_1.checkAdmin, show_1.addShow);
// @route PATCH /show/:id
// @desc update show
// @access Private
router.patch("/:id", checkAuth_1.checkAdmin, show_1.updateShow);
exports.default = router;
