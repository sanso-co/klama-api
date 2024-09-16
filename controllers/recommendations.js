import Recommendations from "../models/recommendations.js";
import axios from "axios";

// create a new show specific for recommendations
export const createShow = async (req, res) => {
    const show = req.body;
    const newShow = new Recommendations(show);
    try {
        const result = await newShow.save();
        res.status(201).json(result);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

// get all shows for recommendations
export const getAllShows = async (req, res) => {
    try {
        const result = await Recommendations.find();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

// get permanent collection details
export const getRecommendationDetails = async (req, res) => {
    const { id: _id } = req.params;
    const { page = 1 } = req.query;

    const limit = 10;

    try {
        const recommendations = await Recommendations.findById(_id);
        if (!recommendations) {
            return res.status(404).json({ message: "recommendations not found" });
        }

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedShows = recommendations.results.slice(startIndex, endIndex);

        const result = {
            shows: paginatedShows,
            totalDocs: recommendations.results.length,
            limit: parseInt(limit, 10),
            totalPages: Math.ceil(recommendations.results.length / limit),
            page: parseInt(page, 10),
            pagingCounter: startIndex + 1,
            hasPrevPage: page > 1,
            hasNextPage: endIndex < recommendations.results.length,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: endIndex < recommendations.results.length ? page + 1 : null,
        };

        const response = {
            id: recommendations.id,
            details: recommendations.details,
            results: result,
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: "Recommendations doesn't exist" });
    }
};

// add a show to a permanent collection
export const addShowToRecommendations = async (req, res) => {
    const { id } = req.params;
    const { recommended } = req.body;

    try {
        const show = await Recommendations.findById(id);

        if (!show) {
            return res.status(404).json({ message: "Show not found" });
        }

        const showExists = show.results.some(
            (existingShow) => existingShow.id === show.id.toString()
        );

        if (showExists) {
            return res.status(400).json({ message: "Show already exists in the recommendations" });
        }

        const updatedShow = await Recommendations.findByIdAndUpdate(
            id,
            { $push: { results: recommended } },
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedShow);
    } catch (error) {
        res.status(500).json({ message: error.message });
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
