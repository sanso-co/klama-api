import axios from "axios";
import Recommendations from "../models/recommendations.js";
import Show from "../models/show.js";

// create or add show to recommendations
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

// get permanent collection details
export const getRecommendationDetails = async (req, res) => {
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

// get all shows for recommendations
export const getAllShows = async (req, res) => {
    try {
        const result = await Recommendations.find().sort({ "details.original_name": 1 });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const TMDB_URL = "https://api.themoviedb.org/3/discover/tv";

export const getRecommendationShows = async (req, res) => {
    const { id } = req.params;
    const { genres, keyword } = req.query;

    const recommendationId = parseInt(id, 10);

    if (isNaN(recommendationId)) {
        return;
    }

    try {
        const recommendations = await Recommendations.findOne({ id: recommendationId });

        let responseArray = [];

        let externalApiParams = {
            api_key: process.env.TMDB_KEY,
            page: 1,
            sort_by: "popularity.desc",
            with_origin_country: "KR",
            with_genres: genres,
            with_type: "2|4",
        };

        if (keyword && keyword.trim() !== "") {
            externalApiParams.with_keywords = keyword;
        }

        if (!recommendations || recommendations.results.length === 0) {
            // **Case 1**: no recommendations or recommendations.results is empty
            try {
                const externalApiResponse = await axios.get(TMDB_URL, {
                    params: externalApiParams,
                });

                responseArray = externalApiResponse.data.results.slice(0, 10);

                return res.status(200).json(responseArray);
            } catch (apiError) {
                console.error("Error calling external API:", apiError);
                return res.status(500).json({ message: "Failed to fetch data from external API" });
            }
        } else if (recommendations.results.length < 10) {
            // **Case 2**: Less than 10 items in recommendations.results

            responseArray = [...recommendations.results];

            try {
                const externalApiResponse = await axios.get(TMDB_URL, {
                    params: externalApiParams,
                });

                const existingIds = new Set(recommendations.results.map((item) => item.id));
                const filteredResults = externalApiResponse.data.results.filter(
                    (item) => !existingIds.has(item.id)
                );

                for (const item of filteredResults) {
                    if (responseArray.length >= 10) break;
                    responseArray.push(item);
                }

                return res.status(200).json(responseArray);
            } catch (apiError) {
                console.error("Error calling external API:", apiError);
                return res.status(500).json({ message: "Failed to fetch data from external API" });
            }
        } else {
            // **Case 3**: 10 or more items in recommendations.results

            return res.status(200).json(recommendations.results);
        }
    } catch (error) {
        console.error("Error fetching recommendations:", error);
        res.status(500).json({ message: "An error occurred while fetching recommendations" });
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
