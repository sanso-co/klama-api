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

// get keyword details
export const getGenreDetails = async (req, res) => {
    const { genreId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    try {
        const genre = await Genre.findOne({ id: genreId });

        if (!genre) {
            return res.status(404).json({ message: "Genre not found" });
        }

        const query = {
            genres: genre,
        };

        const dramas = await Show.find(query)
            .select("id name original_name poster_path first_air_date popularity_score")
            .sort({ original_name: 1 });

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const paginatedDramas = dramas.slice(startIndex, endIndex);

        const result = {
            results: paginatedDramas,
            totalDocs: dramas.length,
            limit: parseInt(limit, 10),
            totalPages: Math.ceil(dramas.length / limit),
            page: parseInt(page, 10),
            pagingCounter: startIndex + 1,
            hasPrevPage: page > 1,
            hasNextPage: endIndex < dramas.length,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: endIndex < dramas.length ? page + 1 : null,
        };

        res.status(200).json({
            id: genre.id,
            name: genre.name,
            original_name: genre.original_name,
            rank: genre.rank,
            shows: result,
        });
    } catch (error) {
        console.error("Error in getKeywordDetails:", error);
        res.status(500).json({ message: "An error occurred while fetching keyword details" });
    }
};
