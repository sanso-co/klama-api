import { RequestHandler } from "express";
import Provider from "../models/provider";
import Show from "../models/show";
import { getSortOptions, sortShows } from "../utilities/sortUtils";
import { RequestQuery } from "../interfaces/api";
import { paginatedResult } from "../utilities/paginateUtils";

export const getProvidersForShow: RequestHandler = async (req, res) => {
    const { showId } = req.params;

    try {
        const drama = await Show.findOne({ id: showId });

        if (!drama) {
            res.status(404).json({ message: "Drama not found" });
            return;
        }

        const providers = await Provider.find({ shows: drama._id }).select(
            "id name logo_path display_priority"
        );

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
    } catch (error) {
        res.status(500).json(error);
    }
};

interface ProviderParams {
    providerId: string;
}

export const getProviderDetails: RequestHandler<ProviderParams, {}, {}, RequestQuery> = async (
    req,
    res
) => {
    const { providerId } = req.params;
    const { page = 1, limit = 30, sort = "date_desc" } = req.query;

    try {
        const sortOptions = getSortOptions(sort);

        const collection = await Provider.findOne({ id: providerId }).populate({
            path: "shows",
            select: "_id id name original_name poster_path genres first_air_date popularity_score",
        });

        if (!collection) {
            res.status(404).json({ message: "Collection not found" });
            return;
        }

        const sortedShows = sortShows(collection.shows, sortOptions);

        const response = paginatedResult(sortedShows, { page, limit });

        res.status(200).json({
            name: collection.name,
            img_path: collection.logo_path,
            ...response,
        });
    } catch (error) {
        res.status(500).json({ message: "Provider collection doesn't exist" });
    }
};
