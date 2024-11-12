import Keyword from "../models/keyword.js";
import Show from "../models/show.js";

export const createKeyword = async (req, res) => {
    const keyword = req.body;

    try {
        const existingKeyword = await Keyword.findOne({ id: keyword.id });

        if (existingKeyword) {
            return res.status(400).json("Keyword already exists");
        }

        const newKeyword = await Keyword.create(keyword);

        res.status(200).json(newKeyword);
    } catch (error) {}
};

// GET ALL KEYWORDS
export const getAllKeywords = async (req, res) => {
    try {
        let keywords = await Keyword.find().sort({
            id: 1,
        });
        res.status(200).json(keywords);
    } catch (error) {
        res.status(500).json(error);
    }
};

// get keywords belong to a show
export const getKeywordsForShow = async (req, res) => {
    const { showId } = req.params;

    try {
        const drama = await Show.findOne({ id: showId });

        if (!drama) {
            return res.status(404).json({ message: "Drama not found" });
        }

        const keywords = await Keyword.find({ shows: drama._id }).select(
            "id name original_name rank"
        );

        const response = {
            id: showId,
            results: keywords.map((keyword) => ({
                id: keyword.id,
                name: keyword.name,
                original_name: keyword.original_name,
                rank: keyword.rank,
            })),
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error);
    }
};

//update keyword
export const updateKeyword = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const updatedKeyword = await Keyword.findOneAndUpdate(
            { id },
            { $set: updatedData },
            { new: true }
        );

        if (!updatedKeyword) {
            return res.status(404).json("Keyword not found");
        }

        res.status(200).json(updatedKeyword);
    } catch (error) {
        res.status(500).json(error);
    }
};

// SEARCH KEYWORD
export const searchKeyword = async (req, res) => {
    const { query, limit = 10 } = req.query;

    if (!query) {
        return res.status(400).json({ message: "Search query is required" });
    }

    try {
        // Create a regex for case-insensitive partial matching
        const regexQuery = new RegExp(query, "i");

        const searchResults = await Keyword.find({
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
