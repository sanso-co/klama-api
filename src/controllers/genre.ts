import { RequestHandler } from "express";
import Genre from "../models/genre";
import { RequestQuery } from "../interfaces/api";

export const getAllGenre: RequestHandler = async (req, res) => {
    try {
        let genres = await Genre.find().sort({
            rank: 1,
        });
        res.status(200).json(genres);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const searchGenre: RequestHandler<{}, {}, {}, RequestQuery> = async (req, res) => {
    const { query, limit = "10" } = req.query;

    if (!query) {
        res.status(400).json({ message: "Search query is required" });
        return;
    }

    try {
        // Create a regex for case-insensitive partial matching
        const regexQuery = new RegExp(query, "i");

        const searchResults = await Genre.find({
            $or: [{ name: regexQuery }, { original_name: regexQuery }],
        })
            .limit(parseInt(limit))
            .select("_id id name original_name rank")
            .lean();

        res.status(200).json(searchResults);
    } catch (error) {
        res.status(500).json({ error });
    }
};
