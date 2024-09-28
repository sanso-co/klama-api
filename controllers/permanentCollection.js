import mongoose from "mongoose";
import permanentCollection from "../models/permanentCollection.js";

// create a new permanent collection: eg. most loved, highly recommended
export const createPermanentCollection = async (req, res) => {
    const collection = req.body;
    const newCollection = new permanentCollection(collection);
    try {
        const result = await newCollection.save();
        res.status(201).json(result);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

// get all permanent collections
export const getAllPermanentCollections = async (req, res) => {
    try {
        const result = await permanentCollection.find();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

// get permanent collection details
export const getPermanentCollectoinDetails = async (req, res) => {
    const { id: _id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    try {
        const collection = await permanentCollection.findById(_id).populate({
            path: "shows",
            select: "id name original_name poster_path first_air_date popularity_score",
        });

        if (!collection) {
            return res.status(404).json({ message: "Collection not found" });
        }

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const paginatedShows = collection.shows.slice(startIndex, endIndex);

        const result = {
            result: paginatedShows,
            totalDocs: collection.shows.length,
            limit: parseInt(limit, 10),
            totalPages: Math.ceil(collection.shows.length / limit),
            page: parseInt(page, 10),
            pagingCounter: startIndex + 1,
            hasPrevPage: page > 1,
            hasNextPage: endIndex < collection.shows.length,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: endIndex < collection.shows.length ? page + 1 : null,
        };

        res.status(200).json({
            name: collection.name,
            description: collection.description,
            shows: result,
        });
    } catch (error) {
        res.status(500).json({ message: "Permanent collection doesn't exist" });
    }
};

// add a show to a permanent collection
export const addShowToPermanentCollection = async (req, res) => {
    const { id } = req.params;
    const { showObjId } = req.body;

    try {
        const collection = await permanentCollection.findById(id);

        if (!collection) {
            return res.status(404).json({ message: "Permanent collection not found" });
        }

        const showExists = collection.shows.includes(showObjId);

        if (showExists) {
            return res.status(400).json({ message: "Show already exists in the collection" });
        }

        if (!mongoose.Types.ObjectId.isValid(showObjId)) {
            return res.status(400).json({ message: "Invalid show ID" });
        }

        const updatedCollection = await permanentCollection.findByIdAndUpdate(
            id,
            { $push: { shows: showObjId } },
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedCollection);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removeShowFromPermanentCollection = async (req, res) => {
    const { id } = req.params;
    const { showId } = req.body;

    try {
        const collection = await permanentCollection.findById(id);

        if (!collection) {
            return res.status(404).json({ message: "Permanent collection not found" });
        }

        const showExists = collection.shows.some((existingShow) => existingShow.id === showId);

        if (!showExists) {
            return res.status(400).json({ message: "Show not found in the collection" });
        }

        const updatedCollection = await permanentCollection.findByIdAndUpdate(
            id,
            { $pull: { shows: { id: showId } } },
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedCollection);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
