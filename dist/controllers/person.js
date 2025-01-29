"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPersonDetails = void 0;
const sortUtils_1 = require("../utilities/sortUtils");
const person_1 = __importDefault(require("../models/person"));
const paginateUtils_1 = require("../utilities/paginateUtils");
const getPersonDetails = async (req, res) => {
    const { personId } = req.params;
    const { page = "1", limit = "30", sort = "date_desc" } = req.query;
    try {
        const sortOptions = (0, sortUtils_1.getSortOptions)(sort);
        const person = await person_1.default.findOne({ id: personId }).populate({
            path: "shows",
            select: "_id id name original_name poster_path genres first_air_date popularity_score",
        });
        if (!person) {
            res.status(404).json({ message: "Person not found" });
            return;
        }
        const sortedShows = (0, sortUtils_1.sortShows)(person.shows, sortOptions);
        const response = (0, paginateUtils_1.paginatedResult)(sortedShows, { page, limit });
        res.status(200).json({
            id: person.id,
            name: person.name,
            original_name: person.original_name,
            img_path: person.profile_path,
            ...response,
        });
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
exports.getPersonDetails = getPersonDetails;
