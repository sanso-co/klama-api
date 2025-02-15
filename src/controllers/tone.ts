import { RequestHandler } from "express";
import Tone from "../models/tone";
import { RequestQuery } from "../interfaces/api";

export const getAllTone: RequestHandler = async (req, res) => {
    try {
        let tone = await Tone.find().sort({
            id: 1,
        });
        res.status(200).json(tone);
    } catch (error) {
        res.status(500).json(error);
    }
};

// SEARCH TONE
export const searchTone: RequestHandler<{}, {}, {}, RequestQuery> = async (req, res) => {
    const { query, limit = "10" } = req.query;

    if (!query) {
        res.status(400).json({ message: "Search query is required" });
        return;
    }

    try {
        // Create a regex for case-insensitive partial matching
        const regexQuery = new RegExp(query, "i");

        const searchResults = await Tone.find({
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

// CREATE A NEW TONE IN THE DASHBOARD
export const createTone: RequestHandler = async (req, res) => {
    const tone = req.body;

    try {
        const existingTone = await Tone.findOne({ id: tone.id });

        if (existingTone) {
            res.status(400).json("Tone already exists");
            return;
        }

        const newTone = await Tone.create(tone);

        res.status(200).json(newTone);
    } catch (error) {
        res.status(500).json(error);
    }
};
