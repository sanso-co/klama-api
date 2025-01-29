import { RequestHandler } from "express";

import { paginatedResult } from "../utilities/paginateUtils";

import PermanentCollection from "../models/permanentCollection";
import { CollectionResponseType, PaginationResponseType, RequestQuery } from "../interfaces/api";
import { getSortOptions } from "../utilities/sortUtils";

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
    const { page = "1", limit = "10", sort = "name_asc" } = req.query;

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
