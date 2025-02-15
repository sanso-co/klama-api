import express from "express";
import {
    getAllShow,
    getShowDetails,
    getShowCategoryList,
    searchShow,
    addShow,
    updateShow,
} from "../controllers/show";
import { checkAdmin } from "../middleware/checkAuth";

const router = express.Router();

// @route GET api/show
// @desc Get all shows
// @access Public
router.get("/", getAllShow);

// @route GET api/show/details/:id
// @desc Get show details
// @access Public
router.get("/details/:id", getShowDetails);

// @route GET api/show/list/:category/:id
// @desc Get show collection by categories
// @access Public
router.get("/list/:category/:id", getShowCategoryList);

// @route GET api/show/search
// @desc Search show
// @access Public
router.get("/search", searchShow);

// @route POST api/show
// @desc Add a new show to the list from TMDB
// @access Private
router.post("/", checkAdmin, addShow);

// @route PATCH api/show/:id
// @desc update show
// @access Private
router.patch("/:id", checkAdmin, updateShow);

export default router;
