import Tone from "../models/tone.js";
import Show from "../models/show.js";

// CREATE A NEW TONE IN THE DASHBOARD
export const createTone = async (req, res) => {
    const tone = req.body;

    try {
        const existingTone = await Tone.findOne({ id: tone.id });

        if (existingTone) {
            return res.status(400).json("Tone already exists");
        }

        const newTone = await Tone.create(tone);

        res.status(200).json(newTone);
    } catch (error) {
        res.status(500).json(error);
    }
};

// GET ALL TONE
export const getAllTone = async (req, res) => {
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
export const searchTone = async (req, res) => {
    const { query, limit = 10 } = req.query;

    if (!query) {
        return res.status(400).json({ message: "Search query is required" });
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
        res.status(500).json({ message: "Error performing search", error: error.message });
    }
};
