import axios from "axios";
import Recommendations from "../models/recommendations.js";
import Show from "../models/show.js";
import { calculateSimilarity } from "../services/similarityService.js";

// GET MANUAL RECOMMENDATIONS
export const getManualRecommendations = async (req, res) => {
    const { showId } = req.params;

    try {
        const recommendation = await Recommendations.findOne({ id: showId }).populate({
            path: "shows",
            select: "id name original_name poster_path first_air_date popularity_score",
        });

        if (!recommendation) {
            return res.status(404).json({ message: "recommendations not found" });
        }

        res.status(200).json(recommendation);
    } catch (error) {
        res.status(500).json({ message: "Recommendations doesn't exist" });
    }
};

// MANUALLY ADD SHOW TO RECOMMENDATIONS
export const addShowToRecommendations = async (req, res) => {
    const { showId } = req.params;
    const { recoShowId } = req.body;

    try {
        const thisShow = await Show.findOne({ id: showId });
        const recoShow = await Show.findOne({ id: recoShowId });

        if (!thisShow || !recoShow) {
            return res.status(404).json({ message: "One or both shows not found" });
        }

        let recommendation = await Recommendations.findOne({ id: showId });

        if (!recommendation) {
            recommendation = await Recommendations.create({
                id: showId,
                details: thisShow._id,
            });
        }

        let recoRecommendation = await Recommendations.findOne({ id: recoShowId });
        if (!recoRecommendation) {
            recoRecommendation = await Recommendations.create({
                id: recoShowId,
                details: recoShow._id,
            });
        }

        const recoExists = recommendation.shows.includes(recoShow._id);
        if (!recoExists) {
            recommendation.shows.push(recoShow._id);
            await recommendation.save();
        }

        const mainShowExists = recoRecommendation.shows.includes(thisShow._id);
        if (!mainShowExists) {
            recoRecommendation.shows.push(thisShow._id);
            await recoRecommendation.save();
        }

        if (!recoExists || !mainShowExists) {
            return res.status(200).json({
                message: "Recommendations updated successfully",
                mainShow: recommendation,
                recommendedShow: recoRecommendation,
            });
        } else {
            return res
                .status(400)
                .json({ message: "Shows already exist in each other's recommendations" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// REORDER RECOMMENDATIONS
export const reorderRecommendations = async (req, res) => {
    try {
        const { showId } = req.params;
        const { shows } = req.body; // string[]

        // Find the recommendations document
        const recommendation = await Recommendations.findOne({ id: Number(showId) });

        if (!recommendation) {
            return res.status(404).json({
                message: "Recommendations not found for this show",
            });
        }

        // Verify that all provided show IDs exist in the current shows array
        const currentShowIds = recommendation.shows.map((show) => show.toString());
        const validReorder = shows.every((showId) => currentShowIds.includes(showId));

        if (!validReorder) {
            return res.status(400).json({
                message: "Invalid show IDs in reorder array",
            });
        }

        // Update the shows array with the new order
        recommendation.shows = shows;
        await recommendation.save();

        // Populate the shows details before sending response
        const updatedRecommendation = await recommendation.populate({
            path: "shows",
            select: "id title poster_path first_air_date",
        });

        return res.status(200).json({
            success: true,
            message: "Recommendations reordered successfully",
            data: updatedRecommendation,
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};

export async function getSimilarRecommendations(req, res) {
    try {
        const { showId } = req.params;
        const recommendations = await calculateSimilarity(showId);

        res.status(200).json(recommendations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
