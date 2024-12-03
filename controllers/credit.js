import Credit from "../models/credit.js";
import Show from "../models/show.js";

export const createCredit = async (req, res) => {
    const credit = req.body;

    try {
        const existingPerson = await Credit.findOne({ id: credit.id });

        if (existingPerson) {
            return res.status(400).json("Credit already exists");
        }

        const newCredit = await Credit.create(credit);

        res.status(200).json(newCredit);
    } catch (error) {
        res.status(500).json(error);
    }
};

// add a show to a credit
export const addShowToCredit = async (req, res) => {
    const { id } = req.params;
    const { showId } = req.body; //show id or mongo id

    try {
        const credit = await Credit.findById(id);
        if (!credit) {
            return res.status(404).json({ message: "Credit not found" });
        }
        const drama = await Show.findOne({ id: showId });

        if (!drama) {
            return res.status(404).json({ message: "Show not found" });
        }

        if (credit.shows.includes(drama._id)) {
            return res.status(400).json({ message: "Drama already exists in the credit" });
        }

        credit.shows.push(drama._id);

        await credit.save();
        res.status(200).json(credit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// get all genres
export const getAllCredits = async (req, res) => {
    try {
        let genres = await Credit.find().sort({
            original_name: 1,
        });
        res.status(200).json(genres);
    } catch (error) {
        res.status(500).json(error);
    }
};

// get credit belong to a show
export const getCreditForShow = async (req, res) => {
    const { showId } = req.params;

    try {
        const show = await Show.findOne({ id: showId });

        if (!show) {
            return res.status(404).json({ message: "Drama not found" });
        }

        const credits = await Credit.find({ shows: show._id })
            .select("id name original_name job")
            .sort({ job: 1 });

        const response = {
            id: showId,
            results: credits.map((credit) => ({
                id: credit.id,
                name: credit.name,
                original_name: credit.original_name,
                job: credit.job,
            })),
        };
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error);
    }
};

//search genre
export const searchKeyword = async (req, res) => {
    const { query, limit = 10 } = req.query;

    if (!query) {
        return res.status(400).json({ message: "Search query is required" });
    }

    try {
        // Create a regex for case-insensitive partial matching
        const regexQuery = new RegExp(query, "i");

        const searchResults = await Credit.find({
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

// get keyword details
export const getCreditDetails = async (req, res) => {
    const { creditId } = req.params;
    const { page = 1, limit = 30 } = req.query;

    try {
        const credit = await Credit.findOne({ id: creditId }).populate({
            path: "shows",
            select: "id name original_name poster_path first_air_date",
        });

        if (!credit) {
            return res.status(404).json({ message: "Credit not found" });
        }

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const paginatedShows = credit.shows.slice(startIndex, endIndex);
        const result = {
            results: paginatedShows,
            totalDocs: credit.shows.length,
            limit: parseInt(limit, 10),
            totalPages: Math.ceil(credit.shows.length / limit),
            page: parseInt(page, 10),
            pagingCounter: startIndex + 1,
            hasPrevPage: page > 1,
            hasNextPage: endIndex < credit.shows.length,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: endIndex < credit.shows.length ? page + 1 : null,
        };

        res.status(200).json({
            id: credit.id,
            name: credit.name,
            original_name: credit.original_name,
            job: credit.job,
            shows: result,
        });
    } catch (error) {
        console.error("Error in getKeywordDetails:", error);
        res.status(500).json({ message: "An error occurred while fetching keyword details" });
    }
};

//update credit
export const updateCredit = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const updatedCredit = await Credit.findOneAndUpdate(
            { id },
            { $set: updatedData },
            { new: true }
        );

        if (!updatedCredit) {
            return res.status(404).json("Credit not found");
        }

        res.status(200).json(updatedCredit);
    } catch (error) {
        res.status(500).json(error);
    }
};
