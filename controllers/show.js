import Show from "../models/show.js";
import Genre from "../models/genre.js";
import Keyword from "../models/keyword.js";
import Tone from "../models/tone.js";
import Network from "../models/network.js";
import Production from "../models/production.js";
import Credit from "../models/credit.js";
import ShowType from "../models/showType.js";

import { getSortOptions, sortShows } from "../utility/sortUtils.js";

const genreMapping = {
    10749: 100, // Romance
    18: 200, // Drama
    35: 300, // Comedy
    9648: 400, // Mystery
    10759: 500, // Action & Adventure
    10765: 700, // Sci-Fi & Fantasy
    80: 800, // Crime
    10751: 900, // Family
};

//add a new show to the list
export const addShow = async (req, res) => {
    const { show } = req.body;

    try {
        const existingShow = await Show.findOne({ id: show.id });

        if (existingShow) {
            return res.status(400).json("Show already exists");
        }

        const genreIds = await Promise.all(
            show.genres.map(async (item) => {
                const mappedGenreId = genreMapping[item.id];

                if (mappedGenreId) {
                    let genre = await Genre.findOne({ id: mappedGenreId });

                    if (genre) {
                        return genre._id;
                    } else {
                        return null;
                    }
                } else {
                    return null;
                }
            })
        );

        show.genres = genreIds.filter(Boolean);

        const networkIds = await Promise.all(
            show.networks.map(async (networkItem) => {
                let network = await Network.findOne({ id: networkItem.id });
                if (!network) {
                    network = await Network.create({
                        id: networkItem.id,
                        name: networkItem.name,
                        logo_path: networkItem.logo_path,
                    });
                }
                return network._id;
            })
        );

        show.networks = networkIds;

        const productionIds = await Promise.all(
            show.production_companies.map(async (productionItem) => {
                let production = await Production.findOne({ id: productionItem.id });
                if (!production) {
                    production = await Production.create({
                        id: productionItem.id,
                        name: productionItem.name,
                        logo_path: productionItem.logo_path,
                    });
                }
                return production._id;
            })
        );

        show.production_companies = productionIds;

        const creditIds = await Promise.all(
            show.created_by.map(async (creditItem) => {
                let credit = await Credit.findOne({ id: creditItem.id });
                if (!credit) {
                    credit = await Credit.create({
                        id: creditItem.id,
                        name: creditItem.name,
                        original_name: creditItem.original_name,
                        job: "",
                    });
                }
                return credit._id;
            })
        );

        show.credits = creditIds;

        let showType = await ShowType.findOne({ id: 1 });
        show.show_type = showType._id;

        const newShow = await Show.create(show);

        res.status(200).json(newShow);
    } catch (error) {
        res.status(500).json(error);
    }
};

// ADD SHOW MANUALLY
export const addNewShow = async (req, res) => {
    const { show } = req.body;

    try {
        let showType = await ShowType.findOne({ id: 1 });
        show.show_type = showType._id;

        if (show.related_seasons) {
            const seasonIds = await Promise.all(
                show.related_seasons.map(async (item) => {
                    let show = await Show.findOne({ id: item });

                    if (show) {
                        return {
                            show: show._id,
                        };
                    } else {
                        return null;
                    }
                })
            );

            show.related_seasons = seasonIds.filter(Boolean);
        }

        const newShow = await Show.create(show);

        res.status(200).json(newShow);
    } catch (error) {
        res.status(500).json(error);
    }
};

// get all shows
export const getAllShow = async (req, res) => {
    const {
        page = 1,
        limit = 40,
        keyword = "",
        genre = "",
        tone = "",
        from = "",
        to = "",
        sort = "alphabetical",
    } = req.query;

    try {
        const query = {};

        if (genre) {
            query.genres = genre;
        }

        if (keyword) {
            // If keyword is comma-separated string, split it into array
            const keywordIds = keyword.includes(",")
                ? keyword.split(",")
                : Array.isArray(keyword)
                ? keyword
                : [keyword];

            // Use $in operator to match any of the keywords
            query.keywords = { $in: keywordIds };
        }

        if (tone) {
            query.tones = tone;
        }

        if (from || to) {
            query.first_air_date = {};

            if (from) {
                query.first_air_date.$gte = new Date(`${from}-01-01T00:00:00.000Z`);
            }

            if (to) {
                query.first_air_date.$lte = new Date(`${to}-12-31T23:59:59.999Z`);
            }
        }

        const sortOption = sort === "newest" ? { first_air_date: -1 } : { original_name: 1 };

        const shows = await Show.find(query)
            .select("id name original_name poster_path first_air_date popularity_score")
            .sort(sortOption);

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedShows = shows.slice(startIndex, endIndex);

        res.status(200).json({
            results: paginatedShows,
            totalDocs: shows.length,
            limit: parseInt(limit, 10),
            totalPages: Math.ceil(shows.length / limit),
            page: parseInt(page, 10),
            pagingCounter: startIndex + 1,
            hasPrevPage: page > 1,
            hasNextPage: endIndex < shows.length,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: endIndex < shows.length ? page + 1 : null,
        });
    } catch (error) {
        res.status(500).json(error);
    }
};

// get show collection by type
export const getShowCollection = async (req, res) => {
    const { type, id } = req.params;
    const { page = 1, limit = 30, sort = "date_desc" } = req.query;

    try {
        const query = {};
        const sortOptions = getSortOptions(sort);

        if (type === "genre") {
            const genreDocument = await Genre.findOne({ id });
            if (genreDocument) {
                query.genres = genreDocument._id;
            } else {
                return res.status(404).json({ message: "Genre not found" });
            }
        }

        if (type === "keyword") {
            const keywordDocument = await Keyword.findOne({ id });
            if (keywordDocument) {
                query.keywords = keywordDocument._id;
            } else {
                return res.status(404).json({ message: "Keyword not found" });
            }
        }

        if (type === "year") {
            const startOfYear = new Date(`${id}-01-01T00:00:00.000Z`);
            const endOfYear = new Date(`${id}-12-31T23:59:59.999Z`);
            query.first_air_date = { $gte: startOfYear, $lte: endOfYear };
        }

        const shows = await Show.find(query)
            .select("id name original_name poster_path first_air_date popularity_score")
            .sort(sortOptions);

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const paginatedShows = shows.slice(startIndex, endIndex);

        const result = {
            results: paginatedShows,
            totalDocs: shows.length,
            limit: parseInt(limit, 10),
            totalPages: Math.ceil(shows.length / limit),
            page: parseInt(page, 10),
            pagingCounter: startIndex + 1,
            hasPrevPage: page > 1,
            hasNextPage: endIndex < shows.length,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: endIndex < shows.length ? page + 1 : null,
        };

        res.status(200).json({
            shows: result,
        });
    } catch (error) {
        res.status(500).json(error);
    }
};

// get show details
export const getShowDetails = async (req, res) => {
    const { id } = req.params;

    try {
        const details = await Show.findOne({ id })
            .populate("genres")
            .populate("networks")
            .populate("keywords")
            .populate("tones")
            .populate({
                path: "related_seasons.show",
                model: "Show",
                select: "_id id name original_name season_number",
            });
        if (!details) {
            return res.status(404).json({ message: "Show not found" });
        }

        res.status(200).json(details);
    } catch (error) {
        res.status(500).json(error);
    }
};

//search show
export const searchShow = async (req, res) => {
    const { query, limit = 10 } = req.query;

    if (!query) {
        return res.status(400).json({ message: "Search query is required" });
    }

    try {
        // Convert the query to a number if it's a valid integer
        const idQuery = !isNaN(query) ? parseInt(query) : null;

        // Create a regex for case-insensitive partial matching
        const regexQuery = new RegExp(query, "i");

        const searchResults = await Show.find({
            $or: [{ id: idQuery }, { name: regexQuery }, { original_name: regexQuery }],
        })
            .limit(parseInt(limit))
            .select("_id id name original_name poster_path genres first_air_date popularity_score")
            .lean();

        res.status(200).json(searchResults);
    } catch (error) {
        res.status(500).json({ message: "Error performing search", error: error.message });
    }
};

// UPDATE SHOW
export const updateShow = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        if (updates.genres) {
            const genreIds = await Promise.all(
                updates.genres.map(async (item) => {
                    let genre = await Genre.findOne({ id: item.id });
                    if (!genre) {
                        genre = await Genre.create({
                            name: item.name,
                            original_name: item.original_name,
                            id: item.id,
                        });
                    }
                    return genre._id;
                })
            );
            updates.genres = genreIds;
        }

        if (updates.keywords) {
            const keywordIds = await Promise.all(
                updates.keywords.map(async (item) => {
                    let keyword = await Keyword.findOne({ id: item.id });
                    if (!keyword) {
                        keyword = await Keyword.create({
                            name: item.name,
                            original_name: item.original_name,
                            id: item.id,
                        });
                    }
                    return keyword._id;
                })
            );
            updates.keywords = keywordIds;
        }

        if (updates.tones) {
            const toneIds = await Promise.all(
                updates.tones.map(async (item) => {
                    let tone = await Tone.findOne({ id: item.id });
                    if (!tone) {
                        tone = await Tone.create({
                            name: item.name,
                            original_name: item.original_name,
                            id: item.id,
                        });
                    }
                    return tone._id;
                })
            );
            updates.tones = toneIds;
        }

        if (updates.poster_path) {
            updates.poster_path = {
                US: {
                    path: updates.poster_path.US?.path,
                },
                KR: {
                    path: updates.poster_path.KR?.path,
                },
            };
        }

        if (updates.trailer) {
            // trailer is always an array with a single object for now
            updates.trailer = [
                {
                    key: updates.trailer.key,
                    site: updates.trailer.site,
                },
            ];
        }

        const updatedShow = await Show.findOneAndUpdate(
            { id: id },
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!updatedShow) {
            return res.status(404).json({ message: "Show not found" });
        }

        res.status(200).json(updatedShow);
    } catch (error) {
        console.error("Error in updatedShow:", error);
        res.status(500).json({
            message: "An error occurred while updating the show",
            error: error.message,
        });
    }
};
