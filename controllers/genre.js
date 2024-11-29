import Genre from "../models/genre.js";
import Show from "../models/show.js";

export const addGenre = async (req, res) => {
    const genre = req.body;

    try {
        const existingGenre = await Genre.findOne({ id: genre.id });

        if (existingGenre) {
            return res.status(400).json("Genre already exists");
        }

        const newGenre = await Genre.create(genre);

        res.status(200).json(newGenre);
    } catch (error) {}
};

// UPDATE GENRE
export const updateGenre = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const updatedGenre = await Genre.findOneAndUpdate(
            { id },
            { $set: updatedData },
            { new: true }
        );

        if (!updatedGenre) {
            return res.status(404).json("Genre not found");
        }

        res.status(200).json(updatedGenre);
    } catch (error) {
        res.status(500).json(error);
    }
};

// get all genres
export const getAllGenre = async (req, res) => {
    try {
        let genres = await Genre.find().sort({
            rank: 1,
        });
        res.status(200).json(genres);
    } catch (error) {
        res.status(500).json(error);
    }
};

//search genre
export const searchGenre = async (req, res) => {
    const { query, limit = 10 } = req.query;

    if (!query) {
        return res.status(400).json({ message: "Search query is required" });
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
        res.status(500).json({ message: "Error performing search", error: error.message });
    }
};
