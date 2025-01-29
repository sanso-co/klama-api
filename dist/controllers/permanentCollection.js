"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPermanentCollectoinDetails = exports.getAllPermanentCollection = void 0;
const paginateUtils_1 = require("../utilities/paginateUtils");
const permanentCollection_1 = __importDefault(require("../models/permanentCollection"));
const sortUtils_1 = require("../utilities/sortUtils");
const getAllPermanentCollection = async (req, res) => {
    try {
        const response = await permanentCollection_1.default.find();
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json(error);
    }
};
exports.getAllPermanentCollection = getAllPermanentCollection;
// get permanent collection details
const getPermanentCollectoinDetails = async (req, res) => {
    const { id: _id } = req.params;
    const { page = "1", limit = "10", sort = "name_asc" } = req.query;
    try {
        const sortOptions = (0, sortUtils_1.getSortOptions)(sort);
        const collection = await permanentCollection_1.default.findById(_id).populate({
            path: "shows",
            select: "id name original_name poster_path first_air_date popularity_score",
            options: { sort: sortOptions },
        });
        if (!collection) {
            res.status(404).json({ message: "Collection not found" });
            return;
        }
        const response = (0, paginateUtils_1.paginatedResult)(collection.shows, { page, limit });
        res.status(200).json({
            name: collection.name,
            description: collection.description || "",
            ...response,
        });
        return;
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
        return;
    }
};
exports.getPermanentCollectoinDetails = getPermanentCollectoinDetails;
