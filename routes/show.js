import express from "express";
import {
    addShow,
    getAllShow,
    getShowCollection,
    getShowDetails,
    searchShow,
    updateShow,
} from "../controllers/show.js";

const router = express.Router();

// @route POST /show
// @desc Add a new show to the list
// @access Private
router.post("/", addShow);

// @route GET /show
// @desc Get all shows
// @access Private
router.get("/", getAllShow);

// @route GET /show/list/:type/:id
// @desc Get show collection by type
// @access Private
router.get("/list/:type/:id", getShowCollection);

// @route GET /show/details/:id
// @desc Get show details
// @access Private
router.get("/details/:id", getShowDetails);

// @route GET /show/search
// @desc Search show
// @access Private
router.get("/search", searchShow);

// @route PATCH /show/:id
// @desc update show
// @access Private
router.patch("/:id", updateShow);

export default router;
