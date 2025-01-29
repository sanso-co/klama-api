"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchGenre = exports.getAllGenre = void 0;
const genre_1 = __importDefault(require("../models/genre"));
const getAllGenre = async (req, res) => {
    try {
        let genres = await genre_1.default.find().sort({
            rank: 1,
        });
        res.status(200).json(genres);
    }
    catch (error) {
        res.status(500).json(error);
    }
};
exports.getAllGenre = getAllGenre;
const searchGenre = async (req, res) => {
    const { query, limit = "10" } = req.query;
    if (!query) {
        res.status(400).json({ message: "Search query is required" });
        return;
    }
    try {
        // Create a regex for case-insensitive partial matching
        const regexQuery = new RegExp(query, "i");
        const searchResults = await genre_1.default.find({
            $or: [{ name: regexQuery }, { original_name: regexQuery }],
        })
            .limit(parseInt(limit))
            .select("_id id name original_name rank")
            .lean();
        res.status(200).json(searchResults);
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
exports.searchGenre = searchGenre;
