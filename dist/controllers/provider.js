"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addShowToProvider = exports.searchProvider = exports.getProviderDetails = exports.getProvidersForShow = exports.getAllProvider = void 0;
const provider_1 = __importDefault(require("../models/provider"));
const show_1 = __importDefault(require("../models/show"));
const sortUtils_1 = require("../utilities/sortUtils");
const paginateUtils_1 = require("../utilities/paginateUtils");
const getAllProvider = async (req, res) => {
    try {
        let providers = await provider_1.default.find().select("id name logo_path display_priority").sort({
            display_priority: 1,
        });
        res.status(200).json(providers);
    }
    catch (error) {
        res.status(500).json(error);
    }
};
exports.getAllProvider = getAllProvider;
const getProvidersForShow = async (req, res) => {
    const { showId } = req.params;
    try {
        const drama = await show_1.default.findOne({ id: showId });
        if (!drama) {
            res.status(404).json({ message: "Drama not found" });
            return;
        }
        const providers = await provider_1.default.find({ shows: drama._id }).select("id name logo_path display_priority");
        const response = {
            id: showId,
            results: providers.map((provider) => ({
                id: provider.id,
                name: provider.name,
                logo_path: provider.logo_path,
                display_priority: provider.display_priority,
            })),
        };
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json(error);
    }
};
exports.getProvidersForShow = getProvidersForShow;
const getProviderDetails = async (req, res) => {
    const { providerId } = req.params;
    const { page = 1, limit = 30, sort = "date_desc" } = req.query;
    try {
        const sortOptions = (0, sortUtils_1.getSortOptions)(sort);
        const collection = await provider_1.default.findOne({ id: providerId }).populate({
            path: "shows",
            select: "_id id name original_name poster_path genres first_air_date popularity_score",
        });
        if (!collection) {
            res.status(404).json({ message: "Collection not found" });
            return;
        }
        const sortedShows = (0, sortUtils_1.sortShows)(collection.shows, sortOptions);
        const response = (0, paginateUtils_1.paginatedResult)(sortedShows, { page, limit });
        res.status(200).json({
            name: collection.name,
            img_path: collection.logo_path,
            ...response,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Provider collection doesn't exist" });
    }
};
exports.getProviderDetails = getProviderDetails;
const searchProvider = async (req, res) => {
    const { query, limit = "10" } = req.query;
    if (!query) {
        res.status(400).json({ message: "Search query is required" });
        return;
    }
    try {
        // Create a regex for case-insensitive partial matching
        const regexQuery = new RegExp(query, "i");
        const searchResults = await provider_1.default.find({
            $or: [{ name: regexQuery }],
        })
            .limit(parseInt(limit))
            .select("_id id name logo_path display_priority")
            .lean();
        res.status(200).json(searchResults);
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
exports.searchProvider = searchProvider;
const addShowToProvider = async (req, res) => {
    const { id } = req.params;
    const { showId } = req.body;
    try {
        const provider = await provider_1.default.findOne({ id });
        if (!provider) {
            res.status(404).json({ message: "Provider not found" });
            return;
        }
        const drama = await show_1.default.findOne({ id: showId });
        if (!drama) {
            res.status(404).json({ message: "Show not found" });
            return;
        }
        if (provider.shows.includes(drama._id)) {
            res.status(400).json({ message: "Drama already exists in the provider" });
            return;
        }
        provider.shows.push(drama._id);
        await provider.save();
        res.status(200).json(provider);
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
exports.addShowToProvider = addShowToProvider;
