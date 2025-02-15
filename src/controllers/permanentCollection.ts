import { RequestHandler } from "express";

import { paginatedResult } from "../utilities/paginateUtils";

import PermanentCollection from "../models/permanentCollection";
import { CollectionResponseType, PaginationResponseType, RequestQuery } from "../interfaces/api";
import { getSortOptions } from "../utilities/sortUtils";
import mongoose from "mongoose";

export const getAllPermanentCollection: RequestHandler = async (req, res) => {
    try {
        const response = await PermanentCollection.find();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error);
    }
};

interface CollectionParams {
    id: string;
}

// get permanent collection details
export const getPermanentCollectoinDetails: RequestHandler<
    CollectionParams,
    CollectionResponseType | { message: string },
    {},
    RequestQuery
> = async (req, res) => {
    const { id: _id } = req.params;
    const { page = "1", limit = "30", sort = "name_asc" } = req.query;

    try {
        const sortOptions = getSortOptions(sort);

        const collection = await PermanentCollection.findById(_id).populate({
            path: "shows",
            select: "id name original_name poster_path first_air_date popularity_score",
            options: { sort: sortOptions },
        });

        if (!collection) {
            res.status(404).json({ message: "Collection not found" });
            return;
        }

        const response = paginatedResult(collection.shows, { page, limit });
        res.status(200).json({
            name: collection.name,
            description: collection.description || "",
            ...response,
        });
        return;
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
        return;
    }
};

export const createPermanentCollection: RequestHandler = async (req, res) => {
    const collection = req.body;
    const newCollection = new PermanentCollection(collection);

    try {
        const result = await newCollection.save();
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const addShowToPermanentCollection: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const { showObjId } = req.body;

    try {
        const collection = await PermanentCollection.findById(id);

        if (!collection) {
            res.status(404).json({ message: "Permanent collection not found" });
            return;
        }

        const showExists = collection.shows.includes(showObjId);

        if (showExists) {
            res.status(400).json({ message: "Show already exists in the collection" });
            return;
        }

        if (!mongoose.Types.ObjectId.isValid(showObjId)) {
            res.status(400).json({ message: "Invalid show ID" });
            return;
        }

        const updatedCollection = await PermanentCollection.findByIdAndUpdate(
            id,
            { $push: { shows: showObjId } },
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedCollection);
    } catch (error) {
        res.status(500).json(error);
    }
};
