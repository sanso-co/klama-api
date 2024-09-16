import express from "express";
import {
    createShow,
    getAllShows,
    getRecommendationDetails,
    addShowToRecommendations,
    getRecommendationShows,
} from "../controllers/recommendations.js";

const router = express.Router();

// @route POST /recommendations
// @desc Create a new show for recommendations
// @access Private
router.post("/", createShow);

// @route GET /recommendations
// @desc Get all shows for recommendations
// @access Private
router.get("/", getAllShows);

// @route GET /recommendations/:id
// @desc Get recommendations details
// @access Private
router.get("/details/:id", getRecommendationDetails);

// @route GET /recommendations/:id
// @desc Get recommendations details
// @access Private
router.get("/shows/:id", getRecommendationShows);

// @route patch /recommendations/add/:id
// @desc Add a new collection to the group
// @access Private
router.patch("/add/:id", addShowToRecommendations);

export default router;
