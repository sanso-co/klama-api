import express from "express";
import { getAllShow, getShowDetails, getShowCategoryList, searchShow } from "../controllers/show";

const router = express.Router();

// @route GET /show
// @desc Get all shows
// @access Public
router.get("/", getAllShow);

// @route GET /show/details/:id
// @desc Get show details
// @access Public
router.get("/details/:id", getShowDetails);

// @route GET /show/list/:category/:id
// @desc Get show collection by categories
// @access Public
router.get("/list/:category/:id", getShowCategoryList);

// @route GET /show/search
// @desc Search show
// @access Public
router.get("/search", searchShow);

export default router;
