"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateShow = exports.addShow = exports.searchShow = exports.getShowCategoryList = exports.getShowDetails = exports.getAllShow = void 0;
const show_1 = __importDefault(require("../models/show"));
const genre_1 = __importDefault(require("../models/genre"));
const keyword_1 = __importDefault(require("../models/keyword"));
const network_1 = __importDefault(require("../models/network"));
const production_1 = __importDefault(require("../models/production"));
const credit_1 = __importDefault(require("../models/credit"));
const showType_1 = __importDefault(require("../models/showType"));
const sortUtils_1 = require("../utilities/sortUtils");
const paginateUtils_1 = require("../utilities/paginateUtils");
const genre_2 = require("../helper/genre");
const getAllShow = async (req, res) => {
    const { page = "1", limit = "30", keyword = "", genre = "", tone = "", from = "", to = "", sort = "name_asc", } = req.query;
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
        const sortOption = sort === "date_desc"
            ? { first_air_date: -1 }
            : { original_name: 1 };
        const shows = await show_1.default.find(query)
            .select("id name original_name poster_path first_air_date popularity_score")
            .sort(sortOption);
        const response = (0, paginateUtils_1.paginatedResult)(shows, { page, limit });
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
exports.getAllShow = getAllShow;
const getShowDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const details = await show_1.default.findOne({ id })
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
            res.status(404).json({ message: "Show not found" });
            return;
        }
        res.status(200).json(details);
    }
    catch (error) {
        res.status(500).json(error);
    }
};
exports.getShowDetails = getShowDetails;
const getShowCategoryList = async (req, res) => {
    const { category, id } = req.params;
    const { page = "1", limit = "30", sort = "name_asc" } = req.query;
    try {
        const query = {};
        const sortOptions = (0, sortUtils_1.getSortOptions)(sort);
        if (category === "genre") {
            const genreDocument = (await genre_1.default.findOne({ id }));
            if (genreDocument) {
                query.genres = genreDocument._id;
            }
            else {
                res.status(404).json({ message: "Genre not found" });
                return;
            }
        }
        if (category === "keyword") {
            const keywordDocument = (await keyword_1.default.findOne({ id }));
            if (keywordDocument) {
                query.keywords = { $in: [keywordDocument._id] };
            }
            else {
                res.status(404).json({ message: "Keyword not found" });
                return;
            }
        }
        if (category === "year") {
            const startOfYear = new Date(`${id}-01-01T00:00:00.000Z`);
            const endOfYear = new Date(`${id}-12-31T23:59:59.999Z`);
            query.first_air_date = { $gte: startOfYear, $lte: endOfYear };
        }
        const shows = await show_1.default.find(query)
            .select("id name original_name poster_path first_air_date popularity_score")
            .sort(sortOptions);
        const response = (0, paginateUtils_1.paginatedResult)(shows, { page, limit });
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
exports.getShowCategoryList = getShowCategoryList;
const searchShow = async (req, res) => {
    const { query, limit = "10" } = req.query;
    if (!query) {
        res.status(400).json({ message: "Search query is required" });
        return;
    }
    try {
        // Convert the query to a number if it's a valid integer
        const parsedNum = Number(query);
        const idQuery = !Number.isNaN(parsedNum) ? parsedNum : null;
        // Create a regex for case-insensitive partial matching
        const regexQuery = new RegExp(query, "i");
        const searchResults = await show_1.default.find({
            $or: [{ id: idQuery }, { name: regexQuery }, { original_name: regexQuery }],
        })
            .limit(parseInt(limit))
            .select("_id id name original_name poster_path genres first_air_date popularity_score")
            .lean();
        res.status(200).json(searchResults);
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
exports.searchShow = searchShow;
const addShow = async (req, res) => {
    const { show: tmdbShow } = req.body;
    try {
        const existingShow = await show_1.default.findOne({ id: tmdbShow.id });
        if (existingShow) {
            res.status(400).json("Show already exists");
            return;
        }
        const showData = {
            id: tmdbShow.id,
            name: tmdbShow.name,
            original_name: tmdbShow.original_name,
            poster_path: tmdbShow.poster_path,
            overview: tmdbShow.overview,
            first_air_date: tmdbShow.first_air_date,
            number_of_episodes: tmdbShow.number_of_episodes,
            homepage: tmdbShow.homepage,
        };
        const genreIds = await Promise.all(tmdbShow.genres.map(async (item) => {
            const mappedGenreId = genre_2.genreMapping[item.id];
            if (mappedGenreId) {
                let genre = await genre_1.default.findOne({ id: mappedGenreId });
                if (genre) {
                    return genre._id;
                }
                else {
                    return null;
                }
            }
            else {
                return null;
            }
        }));
        showData.genres = genreIds.filter(Boolean);
        const networkIds = await Promise.all(tmdbShow.networks.map(async (networkItem) => {
            let network = await network_1.default.findOne({ id: networkItem.id });
            if (!network) {
                network = await network_1.default.create({
                    id: networkItem.id,
                    name: networkItem.name,
                    logo_path: networkItem.logo_path,
                });
            }
            return network._id;
        }));
        showData.networks = networkIds;
        const productionIds = await Promise.all(tmdbShow.production_companies.map(async (productionItem) => {
            let production = await production_1.default.findOne({ id: productionItem.id });
            if (!production) {
                production = await production_1.default.create({
                    id: productionItem.id,
                    name: productionItem.name,
                    logo_path: productionItem.logo_path,
                });
            }
            return production._id;
        }));
        showData.production_companies = productionIds;
        const creditIds = await Promise.all(tmdbShow.created_by.map(async (creditItem) => {
            let credit = await credit_1.default.findOne({ id: creditItem.id });
            if (!credit) {
                credit = await credit_1.default.create({
                    id: creditItem.id,
                    name: creditItem.name,
                    original_name: creditItem.original_name,
                    job: "",
                });
            }
            return credit._id;
        }));
        showData.credits = creditIds;
        let showType = await showType_1.default.findOne({ id: 1 });
        if (showType) {
            showData.show_type = showType._id;
        }
        const newShow = await show_1.default.create(showData);
        res.status(200).json(newShow);
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
exports.addShow = addShow;
const updateShow = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        let updatedData = {};
        if (updates.genres) {
            const genreIds = await Promise.all(updates.genres.map(async (item) => {
                let genre = await genre_1.default.findOne({ id: item.id });
                if (!genre) {
                    genre = await genre_1.default.create({
                        name: item.name,
                        original_name: item.original_name,
                        id: item.id,
                    });
                }
                return genre._id;
            }));
            updatedData.genres = genreIds;
        }
        if (updates.keywords) {
            const keywordIds = await Promise.all(updates.keywords.map(async (item) => {
                let keyword = await keyword_1.default.findOne({ id: item.id });
                if (!keyword) {
                    keyword = await keyword_1.default.create({
                        name: item.name,
                        original_name: item.original_name,
                        id: item.id,
                    });
                }
                return keyword._id;
            }));
            updatedData.keywords = keywordIds;
        }
        if (updates.trailer) {
            updatedData.trailer = [
                {
                    key: updates.trailer.key,
                    site: updates.trailer.site,
                },
            ];
        }
        const updatedShow = await show_1.default.findOneAndUpdate({ id: id }, { $set: updatedData }, { new: true, runValidators: true });
        if (!updatedShow) {
            res.status(404).json({ message: "Show not found" });
            return;
        }
        res.status(200).json(updatedShow);
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
exports.updateShow = updateShow;
