"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addShowToCredit = exports.updateCredit = exports.searchCredit = exports.getCreditDetails = exports.getCreditForShow = exports.getAllCredit = void 0;
const show_1 = __importDefault(require("../models/show"));
const credit_1 = __importDefault(require("../models/credit"));
const sortUtils_1 = require("../utilities/sortUtils");
const paginateUtils_1 = require("../utilities/paginateUtils");
const getAllCredit = async (req, res) => {
    try {
        let credit = await credit_1.default.find().sort({
            original_name: 1,
        });
        res.status(200).json(credit);
    }
    catch (error) {
        res.status(500).json(error);
    }
};
exports.getAllCredit = getAllCredit;
const getCreditForShow = async (req, res) => {
    const { showId } = req.params;
    try {
        const show = await show_1.default.findOne({ id: showId });
        if (!show) {
            res.status(404).json({ message: "Drama not found" });
            return;
        }
        const credits = await credit_1.default.find({ shows: show._id }).sort({ job: 1 });
        const response = {
            id: showId,
            results: credits.map((credit) => ({
                _id: credit._id,
                id: credit.id,
                name: credit.name,
                original_name: credit.original_name,
                job: credit.job,
            })),
        };
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
exports.getCreditForShow = getCreditForShow;
const getCreditDetails = async (req, res) => {
    const { creditId } = req.params;
    const { page = 1, limit = 30, sort = "date_desc" } = req.query;
    try {
        const sortOptions = (0, sortUtils_1.getSortOptions)(sort);
        const credits = await credit_1.default.find({ id: creditId }).populate({
            path: "shows",
            select: "id name original_name poster_path first_air_date",
        });
        if (!credits || credits.length === 0) {
            res.status(404).json({ message: "Credit not found" });
            return;
        }
        const uniqueShows = Array.from(new Set(credits.flatMap((credit) => credit.shows.map((show) => JSON.stringify(show))))).map((showStr) => JSON.parse(showStr));
        const jobs = credits.map((credit) => credit.job);
        const sortedShows = (0, sortUtils_1.sortShows)(uniqueShows, sortOptions);
        const response = (0, paginateUtils_1.paginatedResult)(sortedShows, { page, limit });
        res.status(200).json({
            id: parseInt(creditId),
            name: credits[0].name,
            original_name: credits[0].original_name,
            jobs: jobs,
            ...response,
        });
    }
    catch (error) {
        console.error("Error in getKeywordDetails:", error);
        res.status(500).json({ message: "An error occurred while fetching keyword details" });
    }
};
exports.getCreditDetails = getCreditDetails;
const searchCredit = async (req, res) => {
    const { query, limit = "10" } = req.query;
    if (!query) {
        res.status(400).json({ message: "Search query is required" });
        return;
    }
    try {
        // Create a regex for case-insensitive partial matching
        const regexQuery = new RegExp(query, "i");
        const searchResults = await credit_1.default.find({
            $or: [{ name: regexQuery }, { original_name: regexQuery }],
        })
            .limit(parseInt(limit))
            .select("_id id name original_name job rank")
            .lean();
        res.status(200).json(searchResults);
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
exports.searchCredit = searchCredit;
const updateCredit = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        const updatedCredit = await credit_1.default.findOneAndUpdate({ id }, { $set: updatedData }, { new: true });
        if (!updatedCredit) {
            res.status(404).json("Credit not found");
            return;
        }
        res.status(200).json(updatedCredit);
    }
    catch (error) {
        res.status(500).json(error);
    }
};
exports.updateCredit = updateCredit;
const addShowToCredit = async (req, res) => {
    const { id } = req.params;
    const { showId } = req.body;
    try {
        const credit = await credit_1.default.findById(id);
        if (!credit) {
            res.status(404).json({ message: "Credit not found" });
            return;
        }
        const drama = await show_1.default.findOne({ id: showId });
        if (!drama) {
            res.status(404).json({ message: "Show not found" });
            return;
        }
        if (credit.shows.includes(drama._id)) {
            res.status(400).json({ message: "Drama already exists in the credit" });
            return;
        }
        credit.shows.push(drama._id);
        await credit.save();
        res.status(200).json(credit);
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
exports.addShowToCredit = addShowToCredit;
