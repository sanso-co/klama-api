import express from "express";
import {
    getManualRecommendations,
    getSimilarRecommendations,
    addShowToRecommendations,
    reorderRecommendations,
} from "../controllers/recommendations.js";
import { checkAdmin } from "../middleware/checkAuth.js";

const router = express.Router();

// @route GET /recommendations/details/:id
// @desc Get recommendations details
// @access Private
router.get("/details/:showId", getManualRecommendations);

// @route GET /recommendations/similar/:id
// @desc Get similar recommendations
// @access Private
router.get("/similar/:showId", getSimilarRecommendations);

// @route patch /recommendations/add/:id
// @desc Add a show to recommendations
// @access Private
router.patch("/add/:showId", checkAdmin, addShowToRecommendations);

// @route patch /recommendations/add/:id
// @desc Add a new collection to the group
// @access Private
router.patch("/reorder/:showId", checkAdmin, reorderRecommendations);

export default router;
