import express from "express";
import {
    addShow,
    addNewShow,
    getAllShow,
    getShowCollection,
    getShowDetails,
    searchShow,
    updateShow,
} from "../controllers/show.js";
import { checkAdmin } from "../middleware/checkAuth.js";

const router = express.Router();

// @route POST /show
// @desc Add a new show to the list from TMDB
// @access Private
router.post("/", checkAdmin, addShow);

// @route POST /show
// @desc Add a new show to the list
// @access Private
router.post("/new", checkAdmin, addNewShow);

// @route GET /show
// @desc Get all shows
// @access Public
router.get("/", getAllShow);

// @route GET /show/list/:type/:id
// @desc Get show collection by type
// @access Public
router.get("/list/:type/:id", getShowCollection);

// @route GET /show/details/:id
// @desc Get show details
// @access Public
router.get("/details/:id", getShowDetails);

// @route GET /show/search
// @desc Search show
// @access Public
router.get("/search", searchShow);

// @route PATCH /show/:id
// @desc update show
// @access Private
router.patch("/:id", checkAdmin, updateShow);

export default router;
