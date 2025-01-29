"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addListToCollection = exports.getListFromCollection = exports.getCollection = exports.getAllCollection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const periodicCollection_1 = __importDefault(require("../models/periodicCollection"));
const getAllCollection = async (req, res) => {
    try {
        const response = await periodicCollection_1.default.find();
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json(error);
    }
};
exports.getAllCollection = getAllCollection;
const getCollection = async (req, res) => {
    const { collectionId: _id } = req.params;
    try {
        const response = await periodicCollection_1.default.findById(_id);
        if (!response) {
            res.status(404).json({ message: "Periodic collection not found" });
            return;
        }
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json({ message: "Periodic collection doesn't exist" });
    }
};
exports.getCollection = getCollection;
// get a specific list from a designated collection, e.g., latest from trending.
const getListFromCollection = async (req, res) => {
    const { collectionId, listId } = req.params;
    const { sort } = req.query;
    try {
        const query = {
            _id: collectionId,
        };
        let projection = {};
        if (listId === "latest") {
            // For 'latest', get the first item in the lists array
            projection = {
                lists: 1,
                name: 1,
            };
        }
        else {
            query["lists._id"] = listId;
            projection = {
                "lists.$": 1,
                name: 1,
            };
        }
        const collection = (await periodicCollection_1.default.findOne(query, projection).populate({
            path: "lists.shows",
            select: "id name original_name poster_path first_air_date popularity_score",
        }));
        if (!collection) {
            res.status(404).json({
                message: listId === "latest" ? "No lists found in collection" : "List not found",
            });
            return;
        }
        if (!collection.lists || collection.lists.length === 0) {
            res.status(404).json({
                message: "No lists found in collection",
            });
            return;
        }
        let response = listId === "latest"
            ? collection.lists[collection.lists.length - 1]
            : collection.lists[0];
        if ((sort === "date_asc" || sort === "date_desc") &&
            response.shows &&
            response.shows.length > 0) {
            const isShowType = (show) => {
                return "first_air_date" in show && show.first_air_date !== undefined;
            };
            if (response.shows.every(isShowType)) {
                response.shows.sort((a, b) => {
                    if (!a.first_air_date)
                        return 1;
                    if (!b.first_air_date)
                        return -1;
                    const dateA = new Date(a.first_air_date);
                    const dateB = new Date(b.first_air_date);
                    if (isNaN(dateA.getTime()))
                        return 1;
                    if (isNaN(dateB.getTime()))
                        return -1;
                    return sort === "date_asc"
                        ? dateA.getTime() - dateB.getTime()
                        : dateB.getTime() - dateA.getTime();
                });
            }
        }
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
exports.getListFromCollection = getListFromCollection;
const addListToCollection = async (req, res) => {
    const { id } = req.params;
    const { releaseDate, shows } = req.body;
    try {
        // Validate that each show ID is a valid ObjectId
        const showObjectIds = shows.map((show) => new mongoose_1.default.Types.ObjectId(show));
        const existingCollection = await periodicCollection_1.default.findById(id);
        if (!existingCollection) {
            res.status(404).json({ message: "Periodic collection not found" });
            return;
        }
        const newList = {
            releaseDate,
            shows: showObjectIds,
        };
        existingCollection.lists.push(newList);
        const updatedCollection = await existingCollection.save();
        res.status(200).json(updatedCollection);
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
exports.addListToCollection = addListToCollection;
