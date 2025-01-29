"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchKeyword = exports.getAllKeyword = void 0;
const keyword_1 = __importDefault(require("../models/keyword"));
const getAllKeyword = async (req, res) => {
    try {
        let keywords = await keyword_1.default.find().sort({
            id: 1,
        });
        res.status(200).json(keywords);
    }
    catch (error) {
        res.status(500).json(error);
    }
};
exports.getAllKeyword = getAllKeyword;
const searchKeyword = async (req, res) => {
    const { query, limit = "10" } = req.query;
    if (!query) {
        res.status(400).json({ message: "Search query is required" });
        return;
    }
    try {
        // Create a regex for case-insensitive partial matching
        const regexQuery = new RegExp(query, "i");
        const searchResults = await keyword_1.default.find({
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
exports.searchKeyword = searchKeyword;
