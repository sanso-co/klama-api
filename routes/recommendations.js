import express from "express";
import {
    getAllShows,
    getRecommendationDetails,
    addShowToRecommendations,
    getRecommendationShows,
} from "../controllers/recommendations.js";

const router = express.Router();

// @route GET /recommendations
// @desc Get all shows for recommendations
// @access Private
router.get("/", getAllShows);

// @route GET /recommendations/:id
// @desc Get recommendations details
// @access Private
router.get("/details/:showId", getRecommendationDetails);

// @route GET /recommendations/:id
// @desc Get recommendations details
// @access Private
router.get("/shows/:id", getRecommendationShows);

// @route patch /recommendations/add/:id
// @desc Add a new collection to the group
// @access Private
router.patch("/add/:showId", addShowToRecommendations);

export default router;
